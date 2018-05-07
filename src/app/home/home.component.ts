import { Component, OnInit } from '@angular/core';
import { AutheService } from '../provider/authe.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vitri: any
  constructor(
    private autheService: AutheService,
    private router: Router,
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
  processFiles() {
    const local = localStorage.getItem('currentUser');
    if (local) {
      this.autheService.isLogin = true;
      if (this.autheService) {
        this.router.navigate(['file_root']);
      }
    } else {
      this.router.navigate(['login']);
    }
  }
}

