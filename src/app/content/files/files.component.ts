import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { FolderComponent } from '../files/folder.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  allFiles: IFile[];
  filteredFiles: IFile[];
  keyWord: string;

  constructor(private fileService: FilesService, private diaLog: MatDialog) { }
  ngOnInit() {
    this.loadFiles();
    this.fileService.getThongTinSearch().subscribe(data => {
      this.allFiles = data;
    });

  }
  loadFiles() {
    this.fileService.getFile().subscribe(data => {
      this.allFiles = data;
    });
  }

  deleteFolder() {
    this.fileService.deleteFolder(13).subscribe(data => {
      this.allFiles.splice(12, 1);
    });
  }

  public openDiaLog() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.fileService.getNameFolder().subscribe(folderName => {
          console.log(folderName);
          const newFolder: IFile = {
            name: folderName,
            type: 'folder'
          };
          this.fileService.addFolder(newFolder).subscribe(data => {
            this.allFiles.push(newFolder);
          });
        });
      }
    });
  }

}
