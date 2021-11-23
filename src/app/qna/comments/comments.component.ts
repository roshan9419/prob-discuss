import { Component, Input, OnInit } from '@angular/core';
import { SnackbarType } from 'src/app/core/models/enums/snackbarType';
import { QnAComment } from 'src/app/core/models/qna-comment';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() qnaId!: string;
  @Input() isQuestionComment!: boolean;

  comments: QnAComment[] = [];
  inputComment: string = ''

  constructor(private authService: AuthService, private dbService: DBService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.fetchComments();
  }

  async fetchComments() {
    this.comments = await this.dbService.fetchQnAComments(this.qnaId, this.isQuestionComment);
  }

  addComment() {
    if (!this.authService.isAuthValidated) {
      this.snackbarService.showSnackbar("Login to comment", SnackbarType.INFO);
      return;
    }
    if (!this.inputComment || this.inputComment.length < 10) return;
    const comment = new QnAComment();
    comment.content = this.inputComment;
    comment.qnaId = this.qnaId;
    comment.commentDate = new Date();
    comment.userId = this.authService.userId!;
    comment.username = this.authService.userName!;
    this.dbService.addCommentOnQnA(comment, this.isQuestionComment);
    this.comments.push(comment);
    this.snackbarService.showSnackbar("Comment added", SnackbarType.SUCCESS);
  }

}
