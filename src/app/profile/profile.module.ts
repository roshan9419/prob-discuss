import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileComponent } from './profile.component';



@NgModule({
  declarations: [
    ProfileHeaderComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProfileHeaderComponent
  ]
})
export class ProfileModule { }
