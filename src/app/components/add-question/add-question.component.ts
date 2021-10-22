import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@firebase/util';
import { Question } from 'src/app/models/question';
import { AuthService } from 'src/app/services/auth.service';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  question: Question;
  publishedStatus: string = '';

  constructor(private dbService: DBService, private authService: AuthService) {
    this.question = new Question();
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    try {
      const user = await this.authService.auth.currentUser;
      if (!user) {
        this.publishedStatus = "You're not logged in";
        return;
      }
      this.question.userId = user!.uid;
      this.question.username = user!.displayName!;
      this.question.askedDate = new Date();

      await this.dbService.addQuestion(this.question);
      this.clearFields();
      this.publishedStatus = 'Question published successfuly';
      setTimeout(() => this.publishedStatus = '', 2000);
    } catch (e) {
      console.log(e);
      this.publishedStatus = 'Something went wrong, please try again.';
    }
  }

  fieldsValid() {
    return this.question.title && this.question.content;
  }

  clearFields() {
    this.question.title = '';
    this.question.content = '';
    this.question.tags = '';
  }

}
