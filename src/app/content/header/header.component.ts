import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThongTinUserService } from '../../provider/thongtinuser.service';
import { AutheService } from '../../provider/authe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: '';
  constructor(
    private router: Router,
    private thongTinUser: ThongTinUserService,
    private autheService: AutheService,
  ) { }

  ngOnInit() {
    this.userLogin();
  }
  backToHome() {
    setTimeout(() => {
      this.router.navigate(['']);
    }, 500);
  }
  userLogin() {
    // this.router.navigate(['user']);
    this.thongTinUser.getThongTin().subscribe(user => {
      this.user = user;
    });
  }
  displayUser() {
    const temp = document.querySelectorAll('.details');
    temp[0].classList.toggle('show');
  }
}
