import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ProfileHeaderComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ProfileHeaderComponent
  ]
})
export class ProfileModule { }
