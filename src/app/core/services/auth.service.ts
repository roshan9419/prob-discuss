import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { User } from '../models/user';
import { DBService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState: firebase.User | null = null;

  constructor(private afu: AngularFireAuth, private dbService: DBService) {
    console.log("AuthService Initialized");
    this.afu.authState.subscribe((auth => {
      this.authState = auth;
    }))
  }

  get userId(): string | null {
    return (this.authState !== null) ? this.authState.uid : null;
  }

  get userName(): string | null {
    return (this.authState !== null) ? this.authState.displayName : null;
  }

  get currentUser() {
    return this.authState;
  }

  get isAuthValidated(): boolean {
    return this.authState != null;
  }

  async getUserToken() {
    return await this.authState?.getIdToken();
  }

  async googleLoginIn() {
    const response = await this.afu.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if (!response || !response.user) {
      throw new Error("Failed to login");
    }

    this.authState = response.user;

    // Check if account exists in DB or not
    const isExist = await this.dbService.isUserExists(this.authState.uid);
    if (!isExist) {
      const appUser = new User();
      appUser.userId = this.authState.uid;
      appUser.username = this.authState.displayName!;
      appUser.email = this.authState.email;
      appUser.photoUrl = this.authState.photoURL!;
      appUser.registeredDate = new Date();

      await this.dbService.updateUser(appUser);
    }
    return response.user;
  }

  async signOut(next?: Function) {
    await this.afu.signOut();
    if (next) next();
  }
}
