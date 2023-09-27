import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { HttpClient ,HttpHeaders  } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.component.html',
  styleUrls: ['./webinar.component.css']
})
export class WebinarComponent {

  title: string = '';
  message: string = '';
  urlInput:string = '';
  SelectedAffiliations : any = [];
  titleMaxLength: number = 25;
  messageMaxLength: number = 3000;


    // For Listing Affiliations Based on Organization
    userOrganizationCode : any;
    organization_name_list : any = [];
    selectAllChecked: boolean = false;


  constructor(private renderer: Renderer2, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  WebinarPublishedResponse(){
    Swal.fire({
      icon :'success',
    title : 'Success',
    text : 'Webinar has been successfully published'
    })
  };

  enterMandatoryFields(){
    Swal.fire({
      icon:'error',
      title: 'Cannot publish webinar',
      text:'All fields are mandatory'
    })
  };

  ngAfterViewInit() {
    // Initialize letter counts on component load
    this.updateWebinarTitleLetterCount();
    this.updateWebinarMessageLetterCount();
  }

  updateWebinarTitleLetterCount() {
    const titleInput = document.getElementById('titleInput') as HTMLInputElement;
    this.title = titleInput.value.slice(0, this.titleMaxLength);

    // Update the letter count display
    this.renderer.setProperty(
      titleInput,
      'value',
      this.title
    );
  }

  updateWebinarMessageLetterCount() {
    const messageTextarea = document.getElementById('messageTextarea') as HTMLTextAreaElement;
    this.message = messageTextarea.value.slice(0, this.messageMaxLength);

    // Update the letter count display
    this.renderer.setProperty(
      messageTextarea,
      'value',
      this.message
    );
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
    })
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

  // API Integration for Publishing Webinar
  
  publishWebinar(){
    console.log("this.title",this.title.length);
    console.log("this.message",this.message.length);
    console.log("this.urlInput",this.urlInput.length);
    console.log("this.SelectedAffiliations",this.SelectedAffiliations.length);

   
    const webinarPayloadData = {
      "notification_title":this.title,
      "notification_body":this.message,
      "notification_url":this.urlInput,
      "affiliation_unique_name_list": this.SelectedAffiliations
    }
      
        if(this.title && this.message && this.urlInput && this.SelectedAffiliations.length !== 0){
          this.http.post("https://devserver.indiahealthlink.com/pushnotification/otherClassNotificationTrigger",webinarPayloadData).subscribe((webinardata)=>{
          this.WebinarPublishedResponse();
          return;
          })
        }else{
          this.enterMandatoryFields();
          return;
        }
  }

}
