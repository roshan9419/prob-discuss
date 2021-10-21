import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { HomeQuestionsComponent } from './components/home-questions/home-questions.component';

const routes: Routes = [
  { path: '', component: HomeQuestionsComponent },
  { path: 'ask-question', component: AddQuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
