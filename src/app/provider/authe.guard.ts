import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AutheService } from './authe.service';

@Injectable()
export class AutheGuard implements CanActivate {
  constructor(
    private autheService: AutheService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return Observable.create(observer => {
      this.autheService.isLoggedIn().then(isLoggedIn => {
        isLoggedIn ? observer.next(true) : (
          this.router.navigate(['']),
          observer.next(false)
        );
      });
    });
  }
}

@Injectable()
export class ReverseAutheGuard implements CanActivate {
  constructor(
    private autheService: AutheService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return Observable.create(observer => {
      this.autheService.isLoggedIn().then(isLoggedIn => {
        !isLoggedIn ? observer.next(true) : (
          this.router.navigate(['']),
          observer.next(false)
        );
      });
    });
  }
}
