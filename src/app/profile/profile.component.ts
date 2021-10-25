import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../core/models/user';
import { DBService } from '../core/services/db.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();

  constructor(private activatedroute: ActivatedRoute, private route: Router, private dbService: DBService) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        this.user.userId = params.userId;
        console.log(this.user.userId);
        if (!this.user.userId) {
          console.log("Url not found");
          this.route.navigateByUrl('404');
        }
        this.loadProfile();
      }
    );
  }

  async loadProfile() {
    try {
      const res = await this.dbService.getUser(this.user.userId);
      if (res) this.user = res;
    } catch (error) {
      this.route.navigateByUrl('404');
    }
  }

}
