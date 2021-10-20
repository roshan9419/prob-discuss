import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  question: Question;
  publishedStatus: string = '';

  constructor(private dbService: DBService) {
    this.question = new Question();
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    this.question.userId = 'thisismyrandomuserid';
    this.question.username = 'Roshan Kumar';
    this.question.askedDate = new Date();

    try {
      await this.dbService.addNewQuestion(this.question);
      this.clearFields();
      this.publishedStatus = 'Question published successfuly';
      setTimeout(() => this.publishedStatus = '', 2000);
    } catch (e) {
      console.log(e);
      this.publishedStatus = 'Something went wrong';
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
