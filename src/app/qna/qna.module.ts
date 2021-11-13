import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QnaRoutingModule } from './qna-routing.module';
import { AddQuestionComponent } from './add-question/add-question.component';
import { FormsModule } from '@angular/forms';
import { HomeQuestionsComponent } from './home-questions/home-questions.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionItemComponent } from './question-item/question-item.component';
import { SharedModule } from '../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { AnswersComponent } from './answers/answers.component';
import { QnaUserInfoComponent } from './qna-user-info/qna-user-info.component';

@NgModule({
  declarations: [
    QuestionDetailComponent,
    HomeQuestionsComponent,
    QuestionItemComponent,
    AddQuestionComponent,
    AnswersComponent,
    QnaUserInfoComponent
  ],
  imports: [
    CommonModule,
    QnaRoutingModule,
    FormsModule,
    SharedModule,
    QuillModule.forRoot({
      modules: {
        'toolbar': [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'script': 'super' }, { 'script': 'sub' }],
          [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'formula'],
        ]
      }
    })
  ],
  exports: [
    QuestionDetailComponent,
    HomeQuestionsComponent,
    QuestionItemComponent,
    AddQuestionComponent,
    QnaUserInfoComponent
  ]
})
export class QnaModule { }
