import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HealthtipComponent } from './healthtip/healthtip.component';
import { WebinarComponent } from './webinar/webinar.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

const routes: Routes = [
  {path:"",redirectTo:"login",pathMatch:"full"},
  {path:"login", component:LoginComponent},
  {path:"Healthtip", component:HealthtipComponent},
  {path:"Webinar",component:WebinarComponent},
  {path:"Newsletter",component:NewsletterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
