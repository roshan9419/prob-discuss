import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentChange } from 'ngx-quill';
import { Answer } from 'src/app/core/models/answer';
import { AnswerType } from 'src/app/core/models/enums/answerType';
import { SnackbarType } from 'src/app/core/models/enums/snackbarType';
import { Status } from 'src/app/core/models/enums/status';
import { Question } from 'src/app/core/models/question';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

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

  shareSubject: string = 'ProbDiscuss Question';
  shareBody: string = '';
  shareLink: string = '';

  answers: Answer[] = [];
  usersMap = new Map<string, User>();
  activeAnswerType: AnswerType = AnswerType.RECENT

  isLoading: boolean = true;
  isUserAllowedToAns: boolean = false;

  answer: Answer = new Answer();

  constructor(
    private dbService: DBService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private snackbarService: SnackbarService) {

  }

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
    this.shareLink = `https://probdiscuss-qna.firebaseapp.com/question/${this.question.questionId}`;
    this.shareBody = `Someone asked a question, \"${this.question.title}\"\n\nHave a look on this question:\n${this.shareLink}`;
  }

  // Share links
  get getEmailLink(): string {
    return encodeURI("mailto:?subject=" + this.shareSubject + "&body=" + this.shareBody);
  }

  get getLinkedInLink(): string {
    //https://www.linkedin.com/shareArticle?mini=true&url=http://developer.linkedin.com&title=LinkedIn%20Developer%20Network&summary=My%20favorite%20developer%20program&source=LinkedIn
    return encodeURI("https://www.linkedin.com/shareArticle?mini=true&url=" + this.shareLink);
  }

  get getTwitterLink(): string {
    return encodeURI("https://twitter.com/share?url=" + this.shareLink);
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

  validateAnswer(): boolean {
    if (!this.answer.content) {
      this.snackbarService.showSnackbar("Answer must not be empty", SnackbarType.WARNING);
      return false;
    }
    if (this.answer.content.split(" ").length < 10) {
      this.snackbarService.showSnackbar("Minimum 10 words required", SnackbarType.WARNING);
      return false;
    }
    if (this.answer.content.split(" ").length > 2000) {
      this.snackbarService.showSnackbar("Maximum 2000 words are allowed", SnackbarType.WARNING);
      return false;
    }
    return true;
  }

  async addAnswer() {
    try {
      if (!this.validateAnswer()) return;
      if (!this.authService.isAuthValidated) {
        this.snackbarService.showSnackbar("You're not logged in", SnackbarType.DANGER);
        return;
      }
      this.answer.questionId = this.question.questionId;
      this.answer.questionTitle = this.question.title;
      this.answer.userId = this.authService.userId!;
      this.answer.username = this.authService.userName!;
      this.answer.status = Status.ACTIVE;
      this.answer.answeredDate = new Date();

      await this.dbService.addAnswer(this.answer);
      this.snackbarService.showSnackbar("Answer published successfuly", SnackbarType.SUCCESS);
      this.isUserAllowedToAns = false;
      document.getElementsByClassName("editor")[0].innerHTML = "";
      setTimeout(() => {
        this.router.navigateByUrl(`/question/${this.question.questionId}`);
      }, 1000);
    } catch (e) {
      this.snackbarService.showSnackbar('Something went wrong, please try again.', SnackbarType.WARNING);
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

  async onUpvoteBtnClick(ans: Answer) {
    if (!this.authService.isAuthValidated) {
      this.snackbarService.showSnackbar("You're not logged in", SnackbarType.DANGER);
      return;
    }

    try {
      let isAdd = true;
      if (ans.upvotes?.includes(this.currentUserId()!)) {
        isAdd = false; // Already added, now remove it
      }

      if (!isAdd) {
        this.dialogService.confirm("Are you sure, you want to remove your vote?",
          () => {
            this.removeUpvote(ans);
          }, () => {
            // Dialog cancelled
          }
        );
      } else {
        this.addUpvote(ans);
      }
    } catch (e) {
      this.snackbarService.showSnackbar("Something went wrong", SnackbarType.INFO);
    }
  }

  async addUpvote(ans: Answer) {
    const resp = await this.dbService.addRemoveAnsUpvote(ans.answerId, this.authService.userId!, true);
    if (resp) {
      this.answers[this.answers.indexOf(ans)] = resp;
      this.snackbarService.showSnackbar("Successfuly upvoted this answer", SnackbarType.SUCCESS);
    }
  }

  async removeUpvote(ans: Answer) {
    const resp = await this.dbService.addRemoveAnsUpvote(ans.answerId, this.authService.userId!, false);
    if (resp) {
      this.answers[this.answers.indexOf(ans)] = resp;
      this.snackbarService.showSnackbar("Your vote has been removed", SnackbarType.SUCCESS);
    }
  }

  markAcceptedAnswer(ans: Answer) {
    console.log(ans);
    console.log(ans.upvotes);
    console.log(ans.totalVotes);
    let dialogMessage = "You're going to mark it as accepted answer. Does this answer resolved your problem?";
    let clear = false;
    if (this.question.acceptedAnsId && this.question.acceptedAnsId === ans.answerId) {
      clear = true;
      dialogMessage = "Are you sure you want to unmark the accepted answer?";
    }
    this.dialogService.confirm(dialogMessage,
      async () => {
        this.question.acceptedAnsId = clear ? '' : ans.answerId;
        try {
          await this.dbService.updateQuestion(this.question);
        } catch (e) {
          console.log(e);
        }
      }, () => { }
    );
  }
}
