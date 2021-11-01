import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from 'src/app/core/models/answer';
import { AnswerType } from 'src/app/core/models/enums/answerType';
import { Question } from 'src/app/core/models/question';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

  questionId!: string;
  question?: Question;
  answer: Answer;
  publishedStatus = ''
  answersList: Answer[] = []

  isLoading: boolean = true;

  constructor(private activatedroute: ActivatedRoute, private route: Router, private dbService: DBService, private authService: AuthService, private storageService: StorageService) {
    this.question = new Question();
    this.answer = new Answer();
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
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.route.navigateByUrl('404');
    }
  }

  clearFields() {
    this.answer.content = '';
  }
  
  getImageLink(imgPath: string) {
    return this.storageService.getImageUrl(imgPath);
  }

}
