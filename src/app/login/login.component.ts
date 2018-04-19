import { Component, OnInit } from '@angular/core';

import { AutheService } from '../provider/authe.service';
import { Router } from '@angular/router';
import { ThongTinUserService } from '../provider/thongtinuser.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  routerLink = '[\'content\']';
  constructor(
    private autheService: AutheService,
    private router: Router,
    private thongTinUser: ThongTinUserService,
  ) { }

  ngOnInit() {

  }
  onSubmit(userName: string, passWords: string) {
    this.autheService.Login().subscribe((isAuthe) => {
      if (userName === 'ngtrdai' && passWords === 'anhdaii1') {
        if (isAuthe === true) {
          this.router.navigate(['content']);
          this.thongTinUser.thongTin(userName);
        }
      } else {
        alert('Kiểm tra lại thông tin!');
      }
    });
  }



}
