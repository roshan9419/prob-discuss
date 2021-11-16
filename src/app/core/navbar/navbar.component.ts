import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  contactEmail: string = 'contact@probdiscuss.com'

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   const loader = document.getElementById("loader") as HTMLElement;
    //   loader.hidden = true;
    //   console.log("HERE");
    // }, 500);
  }

  get isLoggedIn() {
    return this.authService.isAuthValidated;
  }

  get userProfilePhoto() {
    return this.authService.currentUser?.photoURL;
  }

  get userProfileName() {
    return this.authService.userName;
  }

  async login() {
    try {
      const user = await this.authService.googleLoginIn();
      // alert(`Welcome, ${user?.displayName}`);
    } catch (e) {
      console.log(e);
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
    } catch (e) {
      console.log(e);
    }
  }

  async viewProfile() {
    if (this.authService.isAuthValidated) {
      this.router.navigateByUrl(`/profile/${this.authService.userId}`);
    }
  }

}
