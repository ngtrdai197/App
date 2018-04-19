import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThongTinUserService } from '../../provider/thongtinuser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: '';
  constructor(private router: Router, private thongTinUser: ThongTinUserService) { }

  ngOnInit() {
    this.userLogin();
  }
  backToHome() {
    setTimeout(() => {
      this.router.navigate(['']);
    }, 5000);
  }
  userLogin() {
    // this.router.navigate(['user']);
    this.thongTinUser.getThongTin().subscribe(user => {
      this.user = user;
    });
  }
}
