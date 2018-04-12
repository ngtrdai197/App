import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  allFiles: IFile[];
  filteredFiles: IFile[];
  keyWord: string;

  constructor(private fileService: FilesService) { }
  ngOnInit() {
    this.loadFiles();
  }
  loadFiles() {
    this.fileService.getFiles().subscribe(data => {
      this.allFiles = data;
      this.filteredFiles = data;
    });
  }

  search(keyWord) {
    const match = new RegExp(keyWord, 'g');
    this.filteredFiles = this.allFiles.filter(file => match.test(file.name) );
  }
}
