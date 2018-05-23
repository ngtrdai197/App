import { Component, OnInit } from '@angular/core';

import { AutheService } from '../provider/authe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThongTinUserService } from '../provider/thongtinuser.service';
import { User } from '../interface/user';
import { UserFireBaseService } from '../provider/usersfirebase.service';
import { ToastrService } from '../provider/toastr.service';
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
    private canActivateRoute: ActivatedRoute,
  ) { }

  ngOnInit() {  }

  onSubmit(userName, passWords) {
    let kiemtra = 0;
    // kiem tra user da dang nhap chua
    this.thongTinUser.getUser().subscribe(userData => {
      this.userTemp = userData;
      //neu length === 0 => data user = 0 => add new user
      if (this.userTemp.length === 0) {
        const subscription = this.usersService.getUsers().subscribe(data => {
          this.usersArr = data;
          this.usersArr.forEach(user => {
            // kiem tra user nhap vao co trong data user khong?
            if (user.userName === userName && user.passWord === passWords) {
              this.autheService.Login().subscribe(isAuthe => {
                if (isAuthe === true) {
                  this.thongTinUser.addUser(user).subscribe(tt => {
                    this.router.navigate(['/root']);
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
            this.toastrService.Warning('Information enter invalid');
          }
        });
      } else {
        // neu data user !=0 => di vao file root
        this.autheService.Login().subscribe(stt => {
          if (stt) {
            this.router.navigate(['/root']);
          }
        });
      }
    });

  }
}
