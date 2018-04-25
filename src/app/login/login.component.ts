import { Component, OnInit } from '@angular/core';

import { AutheService } from '../provider/authe.service';
import { Router } from '@angular/router';
import { ThongTinUserService } from '../provider/thongtinuser.service';
import { User } from '../interface/user';
import { UserFireBaseService } from '../provider/usersfirebase.service';
import { stat } from 'fs';
import { ToastrService } from '../provider/toastr.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  routerLink = '[\'content\']';
  checkStatus: false;
  usersArr: User[];
  constructor(
    private autheService: AutheService,
    private router: Router,
    private thongTinUser: ThongTinUserService,
    private usersService: UserFireBaseService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe(data => {
      this.usersArr = data;
    });
  }
  Warning() {
    this.toastrService.Error('Thông tin không hợp lệ. Kiểm tra lại!');
  }

  onSubmit(userName, passWords) {
    let kiemtra = 0;
    this.usersService.getUsers().subscribe(data => {
      this.usersArr = data;
    });
    for (let i = 0; i < this.usersArr.length; i++) {
      if (this.usersArr[i].userName === userName && this.usersArr[i].passWord === passWords) {
        this.autheService.Login().subscribe((isAuthe) => {
          if (isAuthe === true) {
            this.router.navigate(['content']);
            this.thongTinUser.thongTin(this.usersArr[i]);
          }
        });
        kiemtra = 1;
      } else {
        this.autheService.status(this.checkStatus);
      }
    }
    if (kiemtra === 0) {
      this.Warning();
    }
  }
}
