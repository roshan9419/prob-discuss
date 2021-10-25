import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AddQuestionComponent } from './qna/add-question/add-question.component';
import { HomeQuestionsComponent } from './qna/home-questions/home-questions.component';
import { QuestionDetailComponent } from './qna/question-detail/question-detail.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: HomeQuestionsComponent },
  { path: 'ask-question', component: AddQuestionComponent },
  { path: 'question/:questionId', component: QuestionDetailComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
