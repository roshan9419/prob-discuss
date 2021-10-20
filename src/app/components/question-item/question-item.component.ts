import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.css']
})
export class QuestionItemComponent implements OnInit {

  @Input() questionItem!: Question

  constructor() { }

  ngOnInit(): void {
  }

}
