import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DeleteFileService } from '../../provider/delete.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(
    private fileService: FilesService,
    private statusDeleteService: DeleteFileService,
  ) { }

  ngOnInit() {

  }

  search(value) {
    this.fileService.getAllFile().subscribe(data => {
      const allFiles = data;
      const match = new RegExp(value, 'i');
      const filteredFiles = allFiles.filter(file => match.test(file.name));
      this.fileService.search(filteredFiles);
      // Đưa giá trị của thẻ input
      this.fileService.valueSearchNull(value)
    });
  }

  recycleBin() {
    this.statusDeleteService.statusRecycleBin(true);
  }
  processFolder() {
    this.statusDeleteService.statusAllFiles(true);
  }
}
