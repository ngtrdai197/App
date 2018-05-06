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

  constructor(
    private autheService: AutheService,
    private router: Router,
  ) { }
  temp = 1;

  ngOnInit() {

  }

  processFiles() {
    this.autheService.isLoggedIn().then(isLoggedIn => {
      isLoggedIn ? (
        this.router.navigate(['file_root'])
      ) : (
          this.router.navigate(['login'])
        );
    });
  }
}
