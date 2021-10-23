import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QnaRoutingModule } from './qna-routing.module';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { HomeQuestionsComponent } from './components/home-questions/home-questions.component';
import { QuestionItemComponent } from './components/question-item/question-item.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { FormsModule } from '@angular/forms';


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
    FormsModule
  ],
  exports: [
    QuestionDetailComponent,
    HomeQuestionsComponent, 
    QuestionItemComponent, 
    AddQuestionComponent
  ]
})
export class QnaModule { }
