import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth) {
    console.log("AuthService Initialized");
  }

  async googleLoginIn() {
    const response = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    return response.user;
  }

  async signOut() {
    await this.auth.signOut();
  }
}
