import { Component } from '@angular/core';
import { LoginForm } from '../types/Auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: LoginForm = {
    email : "",
    password : ""
  }
   

IHLLogo : string = "https://apps.indiahealthlink.com/qa/config_portal/assets/images/logo.png";

response : any;

isLoading : Boolean = false;
showLoader :boolean = false;

constructor(private http: HttpClient, private router:Router){}

undefinedErrorMessage(){
  Swal.fire({
    icon :'warning',
    title : 'Invalid Credentials',
    text : 'Please enter Email and Password'
  })
}
invalidInputErrorMessage(){
  Swal.fire({
    icon :'error',
    title : 'Invalid Credentials',
    text : 'Please enter valid login credentials'
  })
}

Login(data:any){
  // console.log(data);
  // console.log(typeof(data));
  // console.log(data.email);
  // console.log(data.password);

  if(data.email == "" && data.password == ""){
    this.undefinedErrorMessage();
    return;
  }
  
  let loginUserList = {
    "userId": "undefined",
    "email": data.email,
    "password": data.password
  };
  this.isLoading = true;
  this.showLoader = true;
  this.http.post('https://azureapi.indiahealthlink.com/login/analyticalLogin', loginUserList).subscribe(resp=>{
    this.response = resp;

    if(this.response !== 'failed'){
      this.router.navigate(["Healthtip"])
      sessionStorage.setItem('User Email',data.email);
      sessionStorage.setItem('isPushNotificationPortalSession','true');
      let organization = this.getOrganizationFromJson(this.response);
      sessionStorage.setItem('userOrg',organization);
      // console.log(organization);
    }else{
      this.invalidInputErrorMessage();
    }
    
    this.isLoading = false;
    this.showLoader = false;
    
  },(error)=>{
    console.error("error",error);
  });
}
getOrganizationFromJson(json: string): string {
  const decodedJson = json.replace(/&quot;/g, '"');
  const data = JSON.parse(decodedJson);
  return data.entireRow.Organization;
}
}
