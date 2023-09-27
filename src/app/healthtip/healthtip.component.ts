// import { Component  } from '@angular/core';
import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Renderer2 } from '@angular/core';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClient ,HttpHeaders  } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { ImageCroppedEvent,base64ToFile } from 'ngx-image-cropper';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import Swal from 'sweetalert2';
import { ImageService } from '../image.service';


@Component({
  selector: 'app-healthtip',
  templateUrl: './healthtip.component.html',
  styleUrls: ['./healthtip.component.css']
})
export class HealthtipComponent implements OnInit {

  //For Validating Inputs
  title: string = '';
  message: string = '';
  SelectedAffiliations : any = [];
  selectedRecommendedlist : any = [];
  titleMaxLength: number = 25;
  messageMaxLength: number = 3000;
  imageFile : File | null = null;

  // For Listing Affiliations Based on Organization
  userOrganizationCode : any;
  organization_name_list : any = [];
  selectAllChecked: boolean = false;

  //Select Recommended List
  recommendationList = new FormControl('');
  recommendedlist: string[] = ['Heart Health', 'Diabetes'];

  //For Image Crop Func

  imageChangedEvent: any = '';
  croppedImage: any = '';
  format: any; //"png"

  // Declare a variable to store the cropped image data URL
    croppedImageData: string | undefined;

    croppedImageFile: File | null = null;

  // Date
  formattedDateTime: any;
  data: any;
  image: any;
  affiliationselectedlist: any;
  recommendationselectedlist: any;

  constructor(private renderer: Renderer2,
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router,
      private imageservice : ImageService) {
        // this.croppedImageData = '';
       }


  PublishHealthTipSuccess(){
Swal.fire({
  icon:'success',
  title:'success',
  text: 'Healthtip is successfully published'
})
  }
  ValidationResponseforHealthTip(){
   Swal.fire({
    icon:'error',
    title:'Cannot Publish healthtip',
    text: 'All fields are mandatory'
   })
  }
  

  ngAfterViewInit() {
    // Initialize letter counts on component load
    this.updateHEalthTipTitleLetterCount();
    this.updateHealthTipMessageLetterCount();
  }

  updateHEalthTipTitleLetterCount() {
    const titleInput = document.getElementById('titleInput') as HTMLInputElement;
    this.title = titleInput.value.slice(0, this.titleMaxLength);

    // Update the letter count display
    this.renderer.setProperty(
      titleInput,
      'value',
      this.title
    );
  }

  updateHealthTipMessageLetterCount() {
    const messageTextarea = document.getElementById('messageTextarea') as HTMLTextAreaElement;
    this.message = messageTextarea.value.slice(0, this.messageMaxLength);

    // Update the letter count display
    this.renderer.setProperty(
      messageTextarea,
      'value',
      this.message
    );
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  //  Affiliations API Integration

  ngOnInit(): void {
    this.http.get<any>('https://devserver.indiahealthlink.com/consult/get_list_of_affiliation').subscribe((getResponse) => {
      // console.log("getResponse", getResponse);
      let affiliationList = getResponse;
      // console.log("affiliationList", affiliationList);
      this.userOrganizationCode = sessionStorage.getItem('userOrg');
      // console.log(this.userOrganizationCode, "User"); 
      
      if (this.userOrganizationCode == 'IHL') {
        affiliationList.forEach((ArrResp:any) => {
          this.organization_name_list.push(ArrResp.company_name);
        });
        // console.log("this.organization_name_list",this.organization_name_list);
      } else {
        affiliationList.forEach((ArrResp:any) => {
          if(this.userOrganizationCode == ArrResp.affilation_code){
            this.organization_name_list.push(ArrResp.company_name);
          }
        });
        // console.log("this.organization_name_list",this.organization_name_list);
      }
    });

    this.formattedDateTime = this.getCurrentDateTime();
  }

  selectAllToggle() {
    if (this.selectAllChecked) {
      // Unselect all checkboxes
      this.SelectedAffiliations = [];
    } else {
      // Select all checkboxes except "Select All"
      this.SelectedAffiliations = this.organization_name_list.slice();
    }

    // Toggle the state of "Select All" checkbox
    this.selectAllChecked = !this.selectAllChecked;

  }

  // Image Crop functionality

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

async imageFileLoad() {
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


async triggerApi() {
  try {
    this.affiliationselectedlist = this.SelectedAffiliations.join(',');
    this.recommendationselectedlist = this.selectedRecommendedlist.join(',');

    console.log("this.title", typeof(this.title));
    console.log("this.title", this.title);
    console.log("this.message", typeof(this.message));
    console.log("this.message", this.message);
    console.log("Date", this.formattedDateTime);
    console.log("this.affiliationselectedlist", typeof(this.affiliationselectedlist));
    console.log("this.affiliationselectedlist", this.affiliationselectedlist);
    console.log("this.recommendationselectedlist", typeof(this.recommendationselectedlist));
    console.log("this.recommendationselectedlist", this.recommendationselectedlist);
    console.log("this.imageFile", typeof(this.image));
    console.log("this.imageFile", this.image);

    if (this.title && this.message && this.affiliationselectedlist !== '' && this.recommendationselectedlist !== '' && this.image !== '') {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('message', this.message);
      formData.append("date", this.formattedDateTime);
      formData.append('SelectedAffiliations', JSON.stringify(this.affiliationselectedlist));
      formData.append('recommendationselectedlist', JSON.stringify(this.recommendationselectedlist));
      formData.append('image',this.image);

      await this.http.post("https://devserver.indiahealthlink.com/pushnotification/store_healthtip_data", formData).toPromise();
      this.PublishHealthTipSuccess();
    } else {
      this.ValidationResponseforHealthTip();
    }
  } catch (error) {
    throw error;
  }
}

PublishHealthTip() {
  this.imageFileLoad();
}

}