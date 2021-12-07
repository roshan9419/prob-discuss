import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/core/models/question';

@Component({
  selector: 'app-srch-ques-item',
  templateUrl: './srch-ques-item.component.html',
  styleUrls: ['./srch-ques-item.component.css']
})
export class SrchQuesItemComponent implements OnInit {

  @Input() hitObj!: any

  constructor() {}

  ngOnInit(): void {
  }

  getTitle() {
    return this.hitObj._highlightResult.title.value;
  }

  getContent() {
    const htmlEl = document.createElement('body');
    htmlEl.innerHTML = this.hitObj.content;
    return htmlEl.innerText;
  }

}
