import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { HomeQuestionsComponent } from './components/home-questions/home-questions.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';

const routes: Routes = [
  { path: '', component: HomeQuestionsComponent },
  { path: 'ask-question', component: AddQuestionComponent },
  { path: 'question/:questionId', component: QuestionDetailComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
