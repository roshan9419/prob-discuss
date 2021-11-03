import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDpComponent } from './components/user-dp/user-dp.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SharedRoutingModule } from './shared-routing.module';
import { TagsComponent } from './components/tags/tags.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';

@NgModule({
  declarations: [
    UserDpComponent,
    PageNotFoundComponent,
    TagsComponent,
    DateAgoPipe
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    UserDpComponent,
    PageNotFoundComponent,
    TagsComponent,
    DateAgoPipe
  ]
})
export class SharedModule { }
