import { Component, OnInit } from '@angular/core';
import { ShowAccountService } from '../../provider/showaccount.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private showAccount: ShowAccountService,
  ) { }

  ngOnInit() {
  }

  displayUser() {
    const temp = 'show';
    this.showAccount.show(temp);
  }
}
