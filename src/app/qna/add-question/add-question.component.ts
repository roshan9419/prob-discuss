import { Component, ElementRef, OnInit } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { SnackbarType } from 'src/app/core/models/enums/snackbarType';
import { Status } from 'src/app/core/models/enums/status';
import { Question } from 'src/app/core/models/question';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DBService } from 'src/app/core/services/db.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { StorageService } from 'src/app/core/services/storage.service';

declare const $: any

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  question: Question;
  publishedStatus: string = '';
  files: File[] = [];
  tags: string[] = [];
  inputTag: string = '';

  imageUrls: string[] | ArrayBuffer[] | null[] = []

  constructor(private elementRef: ElementRef, private dbService: DBService, private authService: AuthService, private storageService: StorageService, private snackbarService: SnackbarService, private apiService: ApiService) {
    this.question = new Question();
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector('#tags')
      .addEventListener('keydown', (e: KeyboardEvent) => {
        const validKey = e.key === ' ' || e.key === 'Enter';
        if (validKey) $(this)[0].addSkill();
        if (!(/^[a-zA-Z()]+$/.test(e.key))) {
          e.preventDefault();
        }
      });
  }

  addSkill() {
    if (!this.tags.includes(this.inputTag) && this.tags.length < 5) {
      this.tags.push(this.inputTag.toLowerCase());
    }
    this.inputTag = "";
  }

  ngOnInit(): void {
  }

  onEditorChange(event: ContentChange) {
    this.question.content = event.html || '';
    if (event.text.trim().length === 0) this.question.content = '';
  }

  validateQuestion(): boolean {
    if (this.question.title.length < 10) {
      this.snackbarService.showSnackbar("Minimum title length is 10", SnackbarType.WARNING);
      return false;
    }
    if (this.question.title.length > 200) {
      this.snackbarService.showSnackbar("Maximum title length is 200", SnackbarType.WARNING);
      return false;
    }
    if (this.question.content.split(" ").length < 10) {
      this.snackbarService.showSnackbar("Minimum 10 words required", SnackbarType.WARNING);
      return false;
    }
    if (this.question.content.split(" ").length > 2000) {
      this.snackbarService.showSnackbar("Maximum 2000 words are allowed", SnackbarType.WARNING);
      return false;
    }
    if (this.tags.length === 0) {
      this.snackbarService.showSnackbar("Provide at-least 1 tag", SnackbarType.WARNING);
      return false;
    }
    return true;
  }

  async onSubmit() {
    try {
      if (!this.validateQuestion()) return;
      if (!this.authService.isAuthValidated) {
        this.snackbarService.showSnackbar("You're not logged in", SnackbarType.DANGER);
        return;
      }
      this.question.userId = this.authService.userId!;
      this.question.username = this.authService.userName!;
      this.question.status = Status.ACTIVE;
      this.question.askedDate = new Date();
      if (this.tags.length !== 0) this.question.tags = this.tags;

      const questionId: string = await this.dbService.addQuestion(this.question);
      if (this.files.length !== 0) {
        this.snackbarService.showSnackbar('Uploading files...', SnackbarType.INFO);
        try {
          this.question.imgPaths = await this.storageService.uploadFileForQuestion(questionId, this.files);
          await this.dbService.updateQuestion(this.question);
        } catch (e) {
          throw e;
        }
      }
      this.clearFields();
      this.snackbarService.showSnackbar('Question published successfuly', SnackbarType.SUCCESS);
      await this.apiService.onQuestionAdded(questionId);
    } catch (e) {
      this.snackbarService.showSnackbar('Something went wrong, please try again.', SnackbarType.WARNING);
    }
  }

  fieldsValid() {
    return this.question.title && this.question.content && this.authService.isAuthValidated;
  }

  isUserLoggedIn() {
    return this.authService.isAuthValidated;
  }

  onFilesChange(event: Event) {
    const target = (event.target as HTMLInputElement);
    const fileList = target.files as FileList;
    this.files = [];
    if (fileList.length > 5) {
      alert("Maximum 5 images are allowed");
      return;
    }
    for (let i = 0; i < Math.min(5, fileList.length); i++) {
      const file = fileList.item(i);
      if ((file?.size || 0) > 1000000) {
        this.files = [];
        alert("Some file's size are greater than 1mb");
        return;
      }
      if (file) {
        this.files[i] = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
          this.imageUrls[i] = reader.result;
        };
      }
    }
  }

  clearFields() {
    this.question.title = '';
    this.question.content = '';
    this.tags = [];
    this.inputTag = '';
    this.files = [];
    document.getElementsByClassName("ql-editor")[0].innerHTML = "";
    this.question = new Question();
  }

  deleteLastTag() {
    this.tags.splice(-1);
  }

  removeFile(idx: number) {
    this.files.splice(idx, 1);
    this.imageUrls.splice(idx, 1);
  }

}
