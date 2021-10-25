import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  getUser() {
    return this.authService.auth.user;
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
      // alert("Logged Out");
    } catch (e) {
      console.log(e);
    }
  }

  async viewProfile() {
    const user = await this.authService.auth.currentUser;
    if (!user) return;
    this.router.navigateByUrl(`/profile/${user.uid}`);
  }

}
