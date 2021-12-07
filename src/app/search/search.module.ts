import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { NgAisModule } from 'angular-instantsearch';
import { SrchQuesItemComponent } from './srch-ques-item/srch-ques-item.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    SearchComponent,
    SrchQuesItemComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    NgAisModule,
    SharedModule,
    CoreModule
  ],
  exports: [
  ]
})
export class SearchModule { }
