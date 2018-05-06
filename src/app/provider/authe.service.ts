import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AutheService {
  firebaseAuth: firebase.auth.Auth;

  constructor() {
    console.log('Authentication Service starting!');
    this.firebaseAuth = firebase.auth();
  }

  logIn(
    email: string,
    password: string,
    onSuccess: (userCred: firebase.auth.UserCredential) => any,
    onFailure: (error: firebase.auth.Error) => any,
  ) {
    try {
      this.firebaseAuth.signInAndRetrieveDataWithEmailAndPassword(email, password)
        .then(userCred => onSuccess(userCred))
        .catch(error => onFailure(error));
    } catch (error) {
      onFailure(error);
    }
  }

  getCurrentUser(): Promise<firebase.User> {
    return new Promise((res, rej) => {
      this.firebaseAuth.onAuthStateChanged((user: firebase.User) => {
        res(user);
      });
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.getCurrentUser().then(user => user !== null);
  }

  logOut() {
    return this.firebaseAuth.signOut();
  }
}
