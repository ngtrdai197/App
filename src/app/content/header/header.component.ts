import { Component, OnInit } from '@angular/core';
import { ShowAccountService } from '../../provider/showaccount.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  kt = 1;
  constructor(
    private showAccount: ShowAccountService,
  ) { }

  ngOnInit() {
  }

  displayUser() {
    if (this.kt === 1) {
      const temp = 'show';
      this.showAccount.show(temp);
      this.kt = 2;
    } else {
      const temp = 'hidden';
      this.showAccount.show(temp);
      this.kt = 1;
    }

  }
}
