import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AutheService } from './authe.service';

@Injectable()
export class AutheGuard implements CanActivate {
  constructor(private autheService: AutheService) { }
  canActivate() {
    if (this.autheService.isLogin === true) {
      return true;
    } else {
      return false;
    }
  }
}
