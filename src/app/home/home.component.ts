import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AutheService } from '../provider/authe.service';
import { ThongTinUserService } from '../provider/thongtinuser.service';
import { User } from '../interface/user';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vitri: any;
  user: User[];
  constructor(
    private autheService: AutheService,
    private router: Router,
    private thongTinUser: ThongTinUserService,
  ) { }

  ngOnInit() {
    $(window).scroll(() => {
      this.vitri = $(window).scrollTop();
      if (this.vitri > 300) {
        $('.back-to-top').addClass('showTop');
      } else {
        $('.back-to-top').removeClass('showTop');
      }
    });
  }

  accessFiles() {
    // this.thongTinUser.getUser().subscribe(user => {
    //   this.user = user;
    //   if (this.user.length != 0) {
    //     this.autheService.Login().subscribe(() => {
    //       this.router.navigate(['root']);
    //     });
    //   } else {
    //     this.router.navigate(['login']);
    //   }

    // })
    this.router.navigate(['login']);
  }

  BackTop() {
    $("html").animate({ scrollTop: 0 }, 700);
  }
  dixuong() {
    const temp = $('.main-content').offset().top;
    $("html").animate({ scrollTop: temp }, 700);
  }
  taiXuong() {
    const temp = $('.travel').offset().top;
    $("html").animate({ scrollTop: temp }, 700);
  }

}

