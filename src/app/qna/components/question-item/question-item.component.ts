import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/core/models/question';

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
