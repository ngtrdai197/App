import { Component, OnInit } from '@angular/core';
import { ThongTinUserService } from './provider/thongtinuser.service';
import { AutheService } from './provider/authe.service';
import { Router } from '@angular/router';
import { User } from './interface/user';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  arrUser: User[];
  constructor(
    private ttUserService: ThongTinUserService,
    private autheService: AutheService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.ttUserService.getUser().subscribe(user => {
      this.arrUser = user;
      if (this.arrUser.length !== 0) {
        this.autheService.Login().subscribe(isLogin => {
          this.router.navigate(['root']);
        });
      }
    });
  }
}
