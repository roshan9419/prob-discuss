import { Component, Input, OnInit } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { Answer } from 'src/app/core/models/answer';
import { AnswerType } from 'src/app/core/models/enums/answerType';
import { Question } from 'src/app/core/models/question';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  @Input() question!: Question;

  answers: Answer[] = [];
  publishedStatus: string = '';

  isLoading: boolean = true;
  isUserAllowedToAns: boolean = false;

  answer: Answer = new Answer();

  constructor(private dbService: DBService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchAnswers();
  }

  async fetchAnswers() {
    try {
      this.answers = await this.dbService.fetchAnswersByQuestionId(this.question.questionId, AnswerType.MOST_RECENT);
      this.isLoading = false;
      if (!this.authService.isAuthValidated) {
        this.isUserAllowedToAns = false;
      } else {
        this.isUserAllowedToAns = this.authService.userId !== this.question.userId;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async addAnswer() {
    if (!this.answer.content) return;
    try {
      if (!this.authService.isAuthValidated) {
        this.publishedStatus = "You're not logged in";
        return;
      }
      this.answer.questionId = this.question.questionId;
      this.answer.questionTitle = this.question.title;
      this.answer.userId = this.authService.userId!;
      this.answer.username = this.authService.userName!;
      this.answer.answeredDate = new Date();

      await this.dbService.addAnswer(this.answer);
      document.getElementsByClassName("ql-editor")[0].innerHTML = "";
      this.answer = new Answer();
      this.publishedStatus = 'Answer published successfuly';
      setTimeout(() => this.publishedStatus = '', 2000);
    } catch (e) {
      console.log(e);
      this.publishedStatus = 'Something went wrong, please try again.';
    }
  }

  onEditorChange(event: ContentChange) {
    this.answer.content = event.html || '';
    if (event.text.trim().length === 0) this.answer.content = '';
  }

  currentUserId() {
    return this.authService.userId;
  }
}
