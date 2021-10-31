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
      this.answersList = await this.dbService.fetchAnswersByQuestionId(this.questionId, AnswerType.MOST_RECENT);
    } catch (e) {
      console.log(e);
      this.route.navigateByUrl('404');
    }
  }

  async addAnswer() {
    if (!this.answer.content) return;
    try {
      const user = await this.authService.auth.currentUser;
      if (!user) {
        this.publishedStatus = "You're not logged in";
        return;
      }
      this.answer.questionId = this.questionId;
      this.answer.userId = user!.uid;
      this.answer.username = user!.displayName!;
      this.answer.answeredDate = new Date();

      await this.dbService.addAnswer(this.answer);
      this.clearFields();
      this.publishedStatus = 'Answer published successfuly';
      setTimeout(() => this.publishedStatus = '', 2000);
    } catch (e) {
      console.log(e);
      this.publishedStatus = 'Something went wrong, please try again.';
    }
  }

  clearFields() {
    this.answer.content = '';
  }
  
  getImageLink(imgPath: string) {
    return this.storageService.getImageUrl(imgPath);
  }

}
