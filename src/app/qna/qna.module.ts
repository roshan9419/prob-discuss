import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QnaRoutingModule } from './qna-routing.module';
import { AddQuestionComponent } from './add-question/add-question.component';
import { FormsModule } from '@angular/forms';
import { HomeQuestionsComponent } from './home-questions/home-questions.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionItemComponent } from './question-item/question-item.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    QuestionDetailComponent, 
    HomeQuestionsComponent, 
    QuestionItemComponent, 
    AddQuestionComponent
  ],
  imports: [
    CommonModule,
    QnaRoutingModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    QuestionDetailComponent,
    HomeQuestionsComponent, 
    QuestionItemComponent, 
    AddQuestionComponent
  ]
})
export class QnaModule { }
