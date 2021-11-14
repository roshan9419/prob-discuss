import { Component, OnInit } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { Question } from 'src/app/core/models/question';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  question: Question;
  publishedStatus: string = '';
  files: File[] = [];
  tags: string = '';

  constructor(private dbService: DBService, private authService: AuthService, private storageService: StorageService) {
    this.question = new Question();
  }

  ngOnInit(): void {
  }

  onEditorChange(event: ContentChange) {
    this.question.content = event.html || '';
    if (event.text.trim().length === 0) this.question.content = '';
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
      if (this.tags.length !== 0) {
        this.question.tags = this.tags.split(',');
      }

      const questionId: string = await this.dbService.addQuestion(this.question);
      if (this.files.length !== 0) {
        this.publishedStatus = 'Uploading files...';
        try {
          this.question.imgPaths = await this.storageService.uploadFileForQuestion(questionId, this.files);
          this.publishedStatus = 'Uploaded';
          await this.dbService.updateQuestion(this.question);
        } catch (e) {
          console.log(e);
        }
      }

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

  onFilesChange(event: Event) {
    const target = (event.target as HTMLInputElement);
    const fileList = target.files as FileList;
    this.files = [];
    if (fileList.length > 5) {
      (<HTMLInputElement>document.getElementById("files")).value = '';
      alert("Maximum 5 images are allowed");
      return;
    }
    for (let i = 0; i < Math.min(5, fileList.length); i++) {
      const file = fileList.item(i);
      if ((file?.size || 0) > 1000000) {
        this.files = [];
        (<HTMLInputElement>document.getElementById("files")).value = '';
        alert("Some file's size are greater than 1mb");
        return;
      }
      if (file) this.files[i] = file;
    }
    console.log(this.files);
  }

  clearFields() {
    this.question.title = '';
    this.question.content = '';
    this.tags = '';
    document.getElementsByClassName("ql-editor")[0].innerHTML = "";
    (<HTMLInputElement>document.getElementById("files")).value = '';
    this.question = new Question();
  }

}
