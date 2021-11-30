import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from 'src/app/core/models/answer';
import { AnswerType } from 'src/app/core/models/enums/answerType';
import { SnackbarType } from 'src/app/core/models/enums/snackbarType';
import { Question } from 'src/app/core/models/question';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
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
  user: User | undefined

  isLoading: boolean = true;

  constructor(
    private activatedroute: ActivatedRoute, 
    private route: Router, 
    private dbService: DBService, 
    private authService: AuthService, 
    private storageService: StorageService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService) {
    this.question = new Question();
    this.answer = new Answer();
  }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        this.questionId = params.questionId;
        // console.log(this.questionId);
        if (!this.questionId) {
          // console.log("Url not found");
          this.route.navigateByUrl("400");
        }
        this.getQuestion();
      }
    );
  }

  async getQuestion() {
    try {
      this.question = await this.dbService.getQuestionById(this.questionId);
      this.user = await this.dbService.getUser(this.question?.userId!);
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

  currentUserId() {
    return this.authService.userId;
  }

  async addUpvote() {
    const resp = await this.dbService.addRemoveQuesUpvote(this.question!.questionId, this.authService.userId!, true);
    if (resp) {
      this.question = resp;
      this.snackbarService.showSnackbar("Successfuly upvoted this answer", SnackbarType.SUCCESS);
    }
  }

  async removeUpvote() {
    const resp = await this.dbService.addRemoveQuesUpvote(this.question!.questionId, this.authService.userId!, false);
    if (resp) {
      this.question = resp;
      this.snackbarService.showSnackbar("Your vote has been removed", SnackbarType.SUCCESS);
    }
  }

  async onUpvoteBtnClick() {
    if (!this.authService.isAuthValidated) {
      this.snackbarService.showSnackbar("You're not logged in", SnackbarType.DANGER);
      return;
    }

    try {
      let isAdd = true;
      if (this.question!.upvotes?.includes(this.currentUserId()!)) {
        isAdd = false; // Already added, now remove it
      }

      if (!isAdd) {
        this.dialogService.confirm("Are you sure, you want to remove your vote?",
          () => {
            this.removeUpvote();
          }, () => {
            // Dialog cancelled
          }
        );
      } else {
        this.addUpvote();
      }
    } catch (e) {
      this.snackbarService.showSnackbar("Something went wrong", SnackbarType.INFO);
    }
  }

}
