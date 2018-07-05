import { Component, OnInit } from '@angular/core';
import { ShowAccountService } from '../../provider/showaccount.service';
import { UserFireBaseService } from '../../provider/usersfirebase.service';
import { Observable } from 'rxjs/Observable';

// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  kt = 1;
  photoURL = '';
  checkShowPhoto = false;
  constructor(
    private showAccount: ShowAccountService,
    private userFirebase: UserFireBaseService,
  ) { }

  ngOnInit() {
    this.showPhotoURL();
  }

  showPhotoURL() {
    // sessionStorage.length !== 2 luu userName + passWord, khi signIn Google "sessionStorage.length === 3" vi co them item: photoURL
    if (sessionStorage.length !== 2) {
      this.photoURL = sessionStorage.getItem('photoURL');
      this.checkShowPhoto = true;

    }

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
