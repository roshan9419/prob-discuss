import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { AddQuestionComponent } from './qna/add-question/add-question.component';
import { HomeQuestionsComponent } from './qna/home-questions/home-questions.component';
import { QuestionDetailComponent } from './qna/question-detail/question-detail.component';
import { SearchComponent } from './search/search.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: HomeQuestionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'ask-question', component: AddQuestionComponent },
  { path: 'question/:questionId', component: QuestionDetailComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
