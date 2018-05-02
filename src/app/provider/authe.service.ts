import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AutheService {
  isLogin = false;
  checkStatus = new BehaviorSubject(null);
  public Login() {
    return new Observable(subscriber => {
      setTimeout(() => {
        this.isLogin = true;
        subscriber.next(this.isLogin);
        subscriber.complete();
      }, 500);
    });
  }
  getStatus() {
    return this.checkStatus.asObservable();
  }
  public status(status) {
    this.checkStatus.next(status);
  }
}
