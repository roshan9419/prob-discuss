import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dp',
  templateUrl: './user-dp.component.html',
  styleUrls: ['./user-dp.component.css']
})
export class UserDpComponent implements OnInit {

  @Input() photoUrl: string | undefined | null = 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png';
  @Input() size: number = 30;

  constructor() { }

  ngOnInit(): void {
  }

}
