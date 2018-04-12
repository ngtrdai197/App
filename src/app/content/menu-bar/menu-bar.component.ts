import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../provider/files.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(private fileService: FilesService) { }

  ngOnInit() {
  }

  // search(keyWord) {
  //   this.fileService.searchFiles(keyWord);
  // }
}
