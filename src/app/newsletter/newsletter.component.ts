import { Component,Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { HttpClient ,HttpHeaders  } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router'; 
import { ImageCroppedEvent,base64ToFile } from 'ngx-image-cropper';
import Swal from 'sweetalert2';
import { ImageService } from '../image.service';



@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  title: string = '';
  titleMaxLength: number = 25;
  documentFile: File | null = null;
  imageFile : File | null = null;


  //For Image Crop Func
    // Declare a variable to store the cropped image data URL
    imageChangedEvent: any = '';
    croppedImage: any = '';
    format: any; //"png"
    image:any;
  
    // Declare a variable to store the cropped image data URL
      croppedImageData: string | undefined;
  
      croppedImageFile: File | null = null;

  //date
  formattedDateTime: any;

  constructor(private renderer: Renderer2,
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router,
      private imageservice : ImageService) { 
    this.croppedImageData = '';
  }


  ngOnInit():void{
    this.formattedDateTime = this.getCurrentDateTime();
  }


  newsletterAllFieldsRequired(){
    Swal.fire({
      icon:'warning',
      title:'Cannot Publish Newsletter',
      text: 'All fields are mandatory'
    })
  }

  publishnewsletterSuccessScenario(){
    Swal.fire({
      icon:'success',
      title:'Success',
      text: 'newsletter published successfully'
    })
  }

  ngAfterViewInit() {
    // Initialize letter counts on component load
    this.updateNewsletterTitleLetterCount();
  }

  updateNewsletterTitleLetterCount() {
    const titleInput = document.getElementById('titleInput') as HTMLInputElement;
    this.title = titleInput.value.slice(0, this.titleMaxLength);

    // Update the letter count display
    this.renderer.setProperty(
      titleInput,
      'value',
      this.title
    );
  }

   // Image Cropper Func

   fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

imageCropped(event: ImageCroppedEvent) {
  if (event.blob) {
    // Create a data URL from the Blob
    const reader = new FileReader();
    reader.onload = () => {
      this.croppedImage = reader.result as string;

      // Assign the cropped image data URL to the variable
      this.croppedImageData = this.croppedImage;
    };
    reader.readAsDataURL(event.blob);
  } else {
    // Handle the case when event.blob is undefined
    console.error('event.blob is undefined');
  }
}
imageLoaded() {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}

  documentInputChange(event:any): void {
    this.documentFile = event.target.files[0] || null;
  }
  async imageFileLoad(){
    try {
      await this.loadImage();
      alert("Image loaded");
      console.log("Image loaded");
      alert("API will be called now");
      await this.triggerApi();
    } catch (error) {
      console.error(error);
    }
  }

  loadImage() {
    return new Promise<void>((resolve, reject) => {
      this.imageservice.base64ToImage(this.croppedImage).subscribe(
        (image) => {
          console.log(image);
          this.image = image;
          resolve(); // Resolve without a value.
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async triggerApi(){

    console.log("this.title",this.title.length);
  console.log("this.documentFile",this.documentFile);
  console.log("this.imageFile",this.croppedImageData);
  console.log("this.formatteddatetime",this.formattedDateTime);
  const newsletterpayload = {
    "title": this.title,
        "publish_date": this.formattedDateTime,
        "data": this.documentFile,
        "image": this.croppedImageData,
  }
  if(this.title && this.documentFile!== null && this.image !== '' ){

    const formData = new FormData();
    formData.append( "title",this.title);
    formData.append( "publish_date",this.formattedDateTime);
    formData.append("documentFile", this.documentFile);
    formData.append("image",this.image);


    this.http.post("https://devserver.indiahealthlink.com/pushnotification/store_newsletter_detail",formData).subscribe((newsletterData:any)=>{
      this.publishnewsletterSuccessScenario();
      return;
    });
  }else{
    this.newsletterAllFieldsRequired();
    return;
  }
  }
  

getCurrentDateTime(): string {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const currentHours = currentDate.getHours().toString().padStart(2, '0');
  const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
  const currentSeconds = currentDate.getSeconds().toString().padStart(2, '0');

  const formattedDateTime = currentYear+"-"+currentMonth+"-"+currentDay+" "+currentHours+":"+currentMinutes+":"+currentSeconds;
  return formattedDateTime;
}

publishNewsLetter(){
  this.imageFileLoad();
}

}
