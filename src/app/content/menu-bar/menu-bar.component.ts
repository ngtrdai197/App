import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  filteredFiles: IFile[];
  allFiles: IFile[];
  keyWord: string;
  temp: Subscription;
  constructor(private fileService: FilesService) { }

  ngOnInit() {
    this.fileService.getFiles().subscribe(data => {
      this.allFiles = data;
      this.filteredFiles = data;
    });
  }

  search(keyWord) {
    // const match = new RegExp(keyWord, 'g');
    // this.filteredFiles = this.allFiles.filter(file => match.test(file.name) );
    // this.temp = this.fileService.search(keyWord);
    this.fileService.search(keyWord);
  }

}
