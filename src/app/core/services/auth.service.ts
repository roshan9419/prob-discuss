import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { User } from '../models/user';
import { DBService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private dbService: DBService) {
    console.log("AuthService Initialized");
  }

  isAuthValidated = async () => {
    const user = await this.auth.currentUser;
    return user != null && user.uid != null;
  }

  async googleLoginIn() {
    const response = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const user = response.user!;
    // Check if account exists in DB or not
    const isExist = await this.dbService.isUserExists(user.uid);
    if (!isExist) {
      const appUser = new User();
      appUser.userId = user.uid;
      appUser.username = user.displayName!;
      appUser.email = user.email;
      appUser.photoUrl = user.photoURL!;
      appUser.registeredDate = new Date();

      await this.dbService.updateUser(appUser);
    }
    return response.user;
  }

  async signOut() {
    await this.auth.signOut();
  }
}
