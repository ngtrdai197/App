import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import * as firebase from 'firebase';

// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    firebase.initializeApp(environment.firebase);
  }
}
