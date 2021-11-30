import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDpComponent } from './components/user-dp/user-dp.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SharedRoutingModule } from './shared-routing.module';
import { TagsComponent } from './components/tags/tags.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { RectPhotoNameComponent } from './components/rect-photo-name/rect-photo-name.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { FormattedDatePipe } from './pipes/formatted-date.pipe';

@NgModule({
  declarations: [
    UserDpComponent,
    PageNotFoundComponent,
    TagsComponent,
    DateAgoPipe,
    RectPhotoNameComponent,
    LoaderComponent,
    ConfirmComponent,
    SnackbarComponent,
    FormattedDatePipe
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    UserDpComponent,
    PageNotFoundComponent,
    TagsComponent,
    RectPhotoNameComponent,
    LoaderComponent,
    ConfirmComponent,
    SnackbarComponent,
    DateAgoPipe,
    FormattedDatePipe
  ]
})
export class SharedModule { }
