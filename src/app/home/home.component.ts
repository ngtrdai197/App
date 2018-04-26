import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  temp = 1;

  ngOnInit() {
    $('.btn').click(function () {
      alert('Say Hello');
    });
    $('.btn2').click(function () {
      if (this.temp === 1) {
        $('.btn').html('Nguyễn Đại');
        this.temp = 2;
      } else {
        $('.btn').html('Sử dụng DCloud');
        this.temp = 1;
      }

    });
  }

}
