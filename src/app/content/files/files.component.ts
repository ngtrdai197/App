import { Component, OnInit, Renderer2 } from '@angular/core';
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
  displayedColumns = ['position', 'name', 'type', 'owner'];
  constructor(
    private fileService: FilesService,
    private diaLog: MatDialog,
    private deleteService: DeleteFileService,
    private renderer: Renderer2,
    private usersService: UserFireBaseService,
  ) { }
  ngOnInit() {
    this.loadFiles();
    this.fileService.getThongTinSearch().subscribe(data => {
      this.allFiles = data;
    });
    this.usersService.getUsers().subscribe(u => {
      this.usersArr = u;
      this.usersArr.forEach(user => {
        console.log(user.userName);
      });
    });
  }
  loadFiles() {
    this.fileService.getFile().subscribe(data => {
      this.allFiles = data;
    });
  }

  public openDiaLog() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.fileService.getNameFolder().subscribe(folderName => {
          const newFolder: IFile = {
            name: folderName,
            type: 'folder'
          };
          this.fileService.addFolder(newFolder).subscribe(data => {
            this.allFiles = this.allFiles.concat(data);
            // this.allFiles = [...this.allFiles, newFolder];
            this.fileService.getFile().subscribe(f => {
              // this.filteredFiles = f;
              console.log('them 1 folder');
              console.log(f);
            });
          });
        });
      }
    });
  }

  getID(idFolder) {
    console.log(idFolder.id);
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
