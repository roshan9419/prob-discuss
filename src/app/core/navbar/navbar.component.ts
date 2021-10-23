import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) { }

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

}
