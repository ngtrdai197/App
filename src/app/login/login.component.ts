import { Component, OnInit } from '@angular/core';

import { AutheService } from '../provider/authe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThongTinUserService } from '../provider/thongtinuser.service';
import { User } from '../interface/user';
import { UserFireBaseService } from '../provider/usersfirebase.service';
import { ToastrService } from '../provider/toastr.service';

// import * as firebase from 'firebase';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Check file delete
  checkStatus: false;
  users: User[];
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
    this.usersService.getUsers().subscribe(user => {
      this.users = user;
    });
    console.log('log ');
    
  }

  onSubmit(userName, passWords) {
    let state = 0;
    this.users.forEach(e => {
      if (e.userName === userName && e.passWords === passWords) {
        state = 1;
        this.autheService.Login().subscribe(isLogin => {
          if (isLogin) {
            sessionStorage.setItem('userName', e.userName);
            sessionStorage.setItem('userEmail', e.email);
            this.router.navigate(['/root']);
          }
        });
      }
    });
    if (state === 0) { this.toastrService.Warning('Information enter invalid'); }
  }

  // signInGoogle() {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithPopup(provider).then(result => {
  //     sessionStorage.clear();
  //     this.autheService.isLogin = true;
  //     this.router.navigate(['/root']);
  //     sessionStorage.setItem('userName', result.user.displayName);
  //     sessionStorage.setItem('userEmail', result.user.email);
  //     sessionStorage.setItem('photoURL', result.user.photoURL);
  //     console.log(result);

  //   }).catch((err) => {
  //     console.log(err);
  //     console.log('fail');
  //   });
  // }

  // signInFacebook() {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   firebase.auth().signInWithPopup(provider).then(result => {
  //   }).catch((err) => {
  //     console.log(err);
  //     console.log('fail');
  //   });
  // }
}
