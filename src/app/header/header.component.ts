import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  IHLLogo : string = "https://apps.indiahealthlink.com/qa/config_portal/assets/images/logo.png";

  constructor(private route:ActivatedRoute,private router:Router) { }

  // For Tablet and Mobile View
  isMenuOpen: boolean = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit(): void {
    const sessionStorageSession = sessionStorage.getItem("isPushNotificationPortalSession");
    if ((!sessionStorageSession)) {
      this.router.navigate(["login"]); 
    }
  }


  // Logout Functionality
  Logout(){
    this.router.navigate(["login"]);
    sessionStorage.clear();
    console.clear()
  }

}
