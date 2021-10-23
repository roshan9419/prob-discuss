import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDpComponent } from './components/user-dp/user-dp.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SharedRoutingModule } from './shared-routing.module';


@NgModule({
  declarations: [
    UserDpComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    UserDpComponent,
    PageNotFoundComponent
  ]
})
export class SharedModule { }
