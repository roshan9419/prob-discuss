import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentChange } from 'ngx-quill';
import { Answer } from 'src/app/core/models/answer';
import { AnswerType } from 'src/app/core/models/enums/answerType';
import { Status } from 'src/app/core/models/enums/status';
import { Question } from 'src/app/core/models/question';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  editorStyle = {
    backgroundColor: 'blue'
  }

  @Input() question!: Question;

  answers: Answer[] = [];
  usersMap = new Map<string, User>();
  activeAnswerType: AnswerType = AnswerType.RECENT

  publishedStatus: string = '';

  isLoading: boolean = true;
  isUserAllowedToAns: boolean = false;

  answer: Answer = new Answer();

  constructor(private dbService: DBService, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      params => {
        // console.log(params);
        let sortType = params.sort;
        if (!sortType || sortType === 'recent') sortType = AnswerType.RECENT;
        else if (sortType === 'votes') sortType = AnswerType.MOST_VOTED;
        else if (sortType === 'oldest') sortType = AnswerType.OLDEST;
        else this.router.navigateByUrl('400');
        this.fetchAnswers(sortType);
      }
    );
  }

  async fetchAnswers(answerType: AnswerType) {
    try {
      this.activeAnswerType = answerType;
      this.answers = await this.dbService.fetchAnswersByQuestionId(this.question.questionId, this.activeAnswerType);

      const userIds: string[] = [];
      this.answers.forEach(item => userIds.push(item.userId));

      if (userIds.length !== 0) {
        this.usersMap = await this.dbService.getUsers(userIds);
      }

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
      this.answer.status = Status.ACTIVE;
      this.answer.answeredDate = new Date();

      await this.dbService.addAnswer(this.answer);
      document.getElementsByClassName("editor")[0].innerHTML = "";
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

  selectedTab(type: string) {
    if (type === 'recent' && this.activeAnswerType === AnswerType.RECENT) return true;
    if (type === 'oldest' && this.activeAnswerType === AnswerType.OLDEST) return true;
    if (type === 'votes' && this.activeAnswerType === AnswerType.MOST_VOTED) return true;
    return false;
  }
}
