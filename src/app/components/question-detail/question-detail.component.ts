import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

  questionId!: string;
  question?: Question;

  constructor(private activatedroute: ActivatedRoute, private route: Router, private dbService: DBService) { 
    this.question = new Question();
  }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        this.questionId = params.questionId;
        console.log(this.questionId);
        if (!this.questionId) {
          console.log("Url not found");
        }
        this.getQuestion();
      }
    );
  }

  async getQuestion() {
    try {
      this.question = await this.dbService.getQuestionById(this.questionId);
    } catch (e) {
      this.route.navigateByUrl('404');
    }
  }

}
