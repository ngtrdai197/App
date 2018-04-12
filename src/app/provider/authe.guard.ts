import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AutheService } from './authe.service';

@Injectable()
export class AutheGuard implements CanActivate {
  constructor(private autheService: AutheService, private router: Router) { }
  canActivate() {
    if (this.autheService.isLogin === true) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
