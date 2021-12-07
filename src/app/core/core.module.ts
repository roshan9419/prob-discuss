import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Services
import { AuthService } from './services/auth.service';
import { DBService } from './services/db.service';
import { StorageService } from './services/storage.service';
import { FooterComponent } from './footer/footer.component';
import { DialogService } from './services/dialog.service';
import { SnackbarService } from './services/snackbar.service';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  providers: [
    DBService,
    AuthService,
    ApiService,
    StorageService,
    DialogService,
    SnackbarService,
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ]
})
export class CoreModule { }
