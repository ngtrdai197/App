import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';

@Injectable()
export class RegisterService {

  constructor() { }
  public register(form: any) {
    return new Observable((subscriber) => {
      setTimeout(
        () => {
          if (form.email === 'aa@gmail.com') {
            subscriber.error({ detail: { email: 'Đã bị trùng'} });
          } else {
            subscriber.next(form);
            subscriber.complete();
          }
        },
        2000,
      );
    });
  }

}
