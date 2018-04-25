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
  // keyWord: string;
  constructor(private fileService: FilesService) { }

  ngOnInit() {
    this.fileService.getFile().subscribe(data => {
      this.allFiles = data;
    });
  }

  search(value) {
    this.fileService.getFile().subscribe(data => {
      this.allFiles = data;
    });
    const match = new RegExp(value, 'i');
    this.filteredFiles = this.allFiles.filter(file => match.test(file.name));
    this.fileService.search(this.filteredFiles);
  }
}
