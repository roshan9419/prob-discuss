import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rect-photo-name',
  templateUrl: './rect-photo-name.component.html',
  styleUrls: ['./rect-photo-name.component.css']
})
export class RectPhotoNameComponent implements OnInit {

  @Input() name: string = '';
  // @Input() photoUrl

  constructor() { }

  ngOnInit(): void {
  }

}
