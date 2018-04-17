import { Component, OnInit } from '@angular/core';

import { AutheService } from '../provider/authe.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  routerLink = '[\'content\']';
  constructor(private autheService: AutheService, private router: Router) { }

  ngOnInit() {

  }
  onSubmit(userName: string, passWords: string) {
    this.autheService.Login().subscribe((isAuthe) => {
      if (userName === 'admin' && passWords === 'admin') {
        if (isAuthe === true) {
          this.router.navigate(['content']);
        }
      } else {
        alert('Kiểm tra lại thông tin!');
      }
    });
  }

}
