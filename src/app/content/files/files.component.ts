import { Component, OnInit, ViewChild } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { FolderComponent } from '../files/folder.component';
import { MatTableDataSource } from '@angular/material';
import { DeleteFileService } from '../../provider/delete.service';
import { UserFireBaseService } from '../../provider/usersfirebase.service';
import { User } from '../../interface/user';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  allFiles: IFile[];
  filteredFiles: IFile[];
  keyWord: string;
  statusDelete = false;
  usersArr: User[];
  idFolder: any;
  dem: number;
  displayedColumns = ['position', 'name', 'type', 'date'];
  constructor(
    private fileService: FilesService,
    private diaLog: MatDialog,
    private deleteService: DeleteFileService,
    private usersService: UserFireBaseService,
  ) { }
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

  public openDiaLogFolder() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.fileService.getNameFolder().subscribe(folderName => {
          if (this.allFiles.length === 0) {
            this.dem = 1;
          } else {
            this.dem = this.allFiles.length + 1;
          }
          const newFolder: IFile = {
            name: folderName,
            type: 'folder',
            date: new Date(Date.now()),
            stt: this.dem,
          };
          this.fileService.addFolder(newFolder).subscribe(data => {
            this.allFiles = this.allFiles.concat(data);
          });
        });
      }
    });
  }

  public openDiaLogFile() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.fileService.getNameFolder().subscribe(fileName => {
          if (this.allFiles.length === 0) {
            this.dem = 1;
          } else {
            this.dem = this.allFiles.length + 1;
          }
          const newFile: IFile = {
            name: fileName,
            type: 'docx',
            date: new Date(Date.now()),
            stt: this.dem,
          };
          this.fileService.addFolder(newFile);
          this.fileService.getFile().subscribe(data => {
            this.allFiles = data;
          });
        });
      }
    });
  }

  getID(idFolder) {
    this.idFolder = idFolder.id;
    this.statusDelete = true;
    this.deleteService.statusDelete(this.statusDelete);
  }


  deleteFolder() {
    this.fileService.deleteFolder(this.idFolder).subscribe(() => {
      this.allFiles.splice(this.idFolder - 1, 1);
      this.fileService.getFile().subscribe(data => {
        this.allFiles = data;
      });
    });
  }

  changeStatus() {
    this.statusDelete = false;
    this.deleteService.statusDelete(this.statusDelete);
  }
}
