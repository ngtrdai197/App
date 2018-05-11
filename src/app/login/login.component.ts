import { Component, OnInit } from '@angular/core';

import { AutheService } from '../provider/authe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThongTinUserService } from '../provider/thongtinuser.service';
import { User } from '../interface/user';
import { UserFireBaseService } from '../provider/usersfirebase.service';
import { ToastrService } from '../provider/toastr.service';
import { Observable } from 'rxjs/observable';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Check file delete
  checkStatus: false;
  usersArr: User[];
  userTemp: User[];
  pathLogin: '';
  constructor(
    private autheService: AutheService,
    private router: Router,
    private thongTinUser: ThongTinUserService,
    private usersService: UserFireBaseService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {

  }

  Warning() {
    this.toastrService.Error('Thông tin không hợp lệ. Kiểm tra lại!');
  }

  onSubmit(userName, passWords) {
    let kiemtra = 0;
    this.thongTinUser.getUser().subscribe(userData => {
      this.userTemp = userData;
      if (this.userTemp.length ===0) {
        const subscription = this.usersService.getUsers().subscribe(data => {
          this.usersArr = data;
          this.usersArr.forEach(user => {
            if (user.userName === userName && user.passWord === passWords) {
              this.autheService.Login().subscribe(isAuthe => {
                if (isAuthe === true) {
                  this.thongTinUser.addUser(user).subscribe(tt => {
                    this.router.navigate(['file_root']);
                  });
                }
              });
              kiemtra = 1;
            } else {
              this.autheService.status(this.checkStatus);
            }
          });
          subscription.unsubscribe();
          if (kiemtra === 0) {
            this.Warning();
          }
        });
      } else {
        this.autheService.Login().subscribe(stt =>{
          if(stt){
            this.router.navigate(['file_root']);
          }
        });
      }
    });


  }
}
