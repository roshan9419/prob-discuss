import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from '../core/services/db.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId: string = ''

  constructor(private activatedroute: ActivatedRoute, private route: Router, private dbService: DBService) {}

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        this.userId = params.userId;
        console.log(this.userId);
        if (!this.userId) {
          console.log("Url not found");
          this.route.navigateByUrl('404');
        }
        this.loadProfile();
      }
    );
  }

  loadProfile() {

  }

}
