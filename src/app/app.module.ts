import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Modules
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { QnaModule } from './qna/qna.module';
import { ProfileModule } from './profile/profile.module';
import { SearchModule } from './search/search.module';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    QnaModule,
    ProfileModule,
    SearchModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }