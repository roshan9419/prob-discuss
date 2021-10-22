import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.css']
})
export class QuestionItemComponent implements OnInit {

  @Input() questionItem!: Question

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onViewQuestion() {
    this.router.navigateByUrl(`/question/${this.questionItem.questionId}`);
  }

}
