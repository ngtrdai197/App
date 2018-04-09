import { Component, OnInit } from '@angular/core';

import { AutheService } from '../authe.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private autheService: AutheService, private router: Router) { }

  ngOnInit() {
  }
  onSubmit(userName: string, passWords: string) {
    this.autheService.Login().subscribe((isAuthe) => {
        if (isAuthe === true) {
          this.router.navigate(['content']);
          console.log('Truy cập files thành công');
        }
    });
  }

}
