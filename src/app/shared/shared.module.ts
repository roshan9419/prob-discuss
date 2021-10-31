import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDpComponent } from './components/user-dp/user-dp.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SharedRoutingModule } from './shared-routing.module';
import { TagComponent } from './components/tag/tag.component';


@NgModule({
  declarations: [
    UserDpComponent,
    PageNotFoundComponent,
    TagComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    UserDpComponent,
    PageNotFoundComponent,
    TagComponent
  ]
})
export class SharedModule { }
