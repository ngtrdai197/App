import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AutheService {
  isLogin = false;
  public Login() {
    return new Observable(subscriber => {
      setTimeout(() => {
        this.isLogin = true;
        subscriber.next(true);
        subscriber.complete();
      }, 1000);
    });
  }
}
