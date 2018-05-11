import { Component, OnInit, ViewChild } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatSort, MatSortable } from '@angular/material';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { DeleteFileService } from '../../provider/delete.service';
import { UserFireBaseService } from '../../provider/usersfirebase.service';
import { User } from '../../interface/user';
import { ThongTinUserService } from '../../provider/thongtinuser.service';
import { FolderComponent } from '../files/folder.component';
import { ShowAccountService } from '../../provider/showaccount.service';
import { FileData } from '../../interface/filedata';
import { AutheService } from '../../provider/authe.service';
import { ToastrService } from '../../provider/toastr.service';

declare var $: any;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  allFiles: any;
  statusDelete = false;
  usersArr: User[];
  user: User[];
  idFolder: any;
  checkRecycle = false;
  kt = 1; // kiểm tra để ẩn hiện chi tiết user
  fileData: FileData[]; // mảng chứa data đổ từ server xuống, thực hiện tìm kiếm folder/file theo id trên server
  recycleBinTemp: IFile[];
  displayedColumns = ['name', 'date', 'type', 'daterepair'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fileService: FilesService,
    private diaLog: MatDialog,
    private router: Router,
    private deleteService: DeleteFileService,
    private usersService: UserFireBaseService,
    private thongTinUser: ThongTinUserService,
    private showAcc: ShowAccountService,
    private autheService: AutheService,
    private toaStrService: ToastrService,
  ) { }

  ngOnInit() {
    this.loadFiles();
    this.reLoadFiles();
    this.fileService.getThongTinSearch().subscribe(data => {
      this.allFiles = new MatTableDataSource(data);
      this.allFiles.sort = this.sort;
    });
    this.userLogin();
    this.showAccount();
  }

  loadFiles() {
    this.fileService.getFile().subscribe(data => {
      this.allFiles = new MatTableDataSource(data);
    });
    this.deleteService.getStatusRecycleBin().subscribe(stt => {
      const _kt = stt;
      if (_kt === true) {
        this.fileService.getRecycleBin().subscribe(data => {
          this.allFiles = new MatTableDataSource(data);
          console.log(data);
        });
      }
    });

  }

  reLoadFiles() {
    this.deleteService.getStatusAllFiles().subscribe(stt => {
      const _kt = stt;
      if (_kt === true) {
        this.fileService.getFile().subscribe(data => {
          this.allFiles = new MatTableDataSource(data);
        });
      }
    });
  }

  sortName() {
    this.allFiles.sort = this.sort;
  }

  public openDiaLogFolder() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(folderName => {
          this.fileService.getFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === folderName.toLowerCase()) {
                checkName = false; // tên folder đã tồn tại => trả về false
              }
            });
            // nếu tên folder chưa tồn tại => true => thêm folder
            if (checkName === true) {
              const newFolder: IFile = {
                name: folderName,
                type: 'folder',
                date: new Date(Date.now()),
                daterepair: new Date(Date.now()),
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile().subscribe(data => {
                  this.allFiles = new MatTableDataSource(data);
                  this.allFiles.sort = this.sort;
                });
              });
            } else {
              this.toaStrService.Error('Tên folder nhập đã trùng. Vui lòng kiểm tra lại !');
            }
          });
        });
        subscription.unsubscribe();
      }
    });
  }

  public openDiaLogFile() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === fileName.toLowerCase()) {
                checkName = false; // tên folder đã tồn tại => trả về false
              }
            });
            // nếu tên folder chưa tồn tại => true => thêm folder
            if (checkName === true) {
              const newFolder: IFile = {
                name: fileName,
                type: 'docx',
                date: new Date(Date.now()),
                daterepair: new Date(Date.now()),
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile().subscribe(data => {
                  this.allFiles = new MatTableDataSource(data);
                  this.allFiles.sort = this.sort;
                });
              });
            } else {
              this.toaStrService.Error('Tên file nhập đã trùng. Vui lòng kiểm tra lại !');
            }
          });
        });
        subscription.unsubscribe();
      }
    });
  }
  public openDiaLogFileExcel() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === fileName.toLowerCase()) {
                checkName = false; // tên folder đã tồn tại => trả về false
              }
            });
            // nếu tên folder chưa tồn tại => true => thêm folder
            if (checkName === true) {
              const newFolder: IFile = {
                name: fileName,
                type: 'excel',
                date: new Date(Date.now()),
                daterepair: new Date(Date.now()),
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile().subscribe(data => {
                  this.allFiles = new MatTableDataSource(data);
                  this.allFiles.sort = this.sort;
                });
              });
            } else {
              this.toaStrService.Error('Tên file nhập đã trùng. Vui lòng kiểm tra lại !');
            }
          });
        });
        subscription.unsubscribe();
      }
    });
  }
  public openDiaLogFilePowerPoint() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === fileName.toLowerCase()) {
                checkName = false; // tên folder đã tồn tại => trả về false
              }
            });
            // nếu tên folder chưa tồn tại => true => thêm folder
            if (checkName === true) {
              const newFolder: IFile = {
                name: fileName,
                type: 'pp',
                date: new Date(Date.now()),
                daterepair: new Date(Date.now()),
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile().subscribe(data => {
                  this.allFiles = new MatTableDataSource(data);
                  this.allFiles.sort = this.sort;
                });
              });
            } else {
              this.toaStrService.Error('Tên file nhập đã trùng. Vui lòng kiểm tra lại !');
            }
          });
        });
        subscription.unsubscribe();
      }
    });
  }
  getID(dataRow) {
    this.idFolder = dataRow.id;
    this.statusDelete = true;
    this.deleteService.statusDelete(this.statusDelete);
    if (dataRow.id) {
      $('.statusDelete').removeClass('active');
      $('#dele' + dataRow.id).addClass('active');
    }
    this.fileService.nameFolder(dataRow.name);
    this.fileService._idFolder(dataRow.id);
  }

  renameFolder() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getFile().subscribe(data => {
            // mảng filData chứa data từ server
            this.fileData = data;
            const subscriptionRename = this.fileService.getIdFolder().subscribe(dataID => {
              // mảng filData chứa data từ server, chứa id của từng object => duyệt mảng để xóa đúng folder chọn
              this.fileData.forEach(items => {
                if (items.id === dataID) {
                  items.name = fileName;
                  items.daterepair = new Date(Date.now());
                  this.fileService.updateNameFolder(items, dataID).subscribe(() => {
                    this.fileService.getFile().subscribe(datFolder => {
                      this.allFiles = new MatTableDataSource(datFolder);
                      this.allFiles.sort = this.sort;
                    });
                  });
                  return;
                }
              });
            });
            // unsubscribe sau mỗi lần rename tránh cho liên tục cập nhật tên folder tự động rename khi chưa chọn rename
            subscriptionRename.unsubscribe();
          });
        });
        subscription.unsubscribe();
      }
    });
  }

  deleteFolder() {
    let check = false;
    const subscription = this.fileService.getFile().subscribe(data => {
      this.fileData = data;
      this.recycleBinTemp = data;
      for (let index = 0; index < this.fileData.length; index++) {
        if (this.idFolder === this.fileData[index].id) {
          this.recycleBinTemp[0] = this.fileData[index];
          this.recycleBinTemp.splice(1, this.recycleBinTemp.length - 1);
          this.fileService._recycleBin(this.recycleBinTemp[0]);
          check = true;
          return;
        }
      }
      subscription.unsubscribe();
    });
    if (check = true) {
      this.fileService.deleteFolder(this.idFolder).subscribe(() => {
        this.fileService.getFile().subscribe(data => {
          this.allFiles = new MatTableDataSource(data);
          this.allFiles.sort = this.sort;
        });
      });
    }
  }

  // check row được chọn và đánh dấu để xóa
  changeStatus() {
    this.statusDelete = false;
    this.deleteService.statusDelete(this.statusDelete);
    $('.statusDelete').removeClass('active');
  }

  // lấy thông tin của user đăng nhập vào để hiển thị chi tiết thông tin user
  userLogin() {
    this.thongTinUser.getUser().subscribe(user => {
      this.user = user;

    });
  }
  backToHome() {
    setTimeout(() => {
      this.thongTinUser.deleteUser(1).subscribe(() => {
        this.router.navigate(['home']);
      });
    }, 500);
  }

  // đóng-mở thông tin chi tiết của user
  showAccount() {
    this.showAcc.getShowAccount().subscribe(s => {
      const temp = s;
      if (temp === 'show') {
        if (this.kt === 1) {
          $('.details-user').addClass('show');
          $('.content-files').addClass('hien');
          this.kt = 2;
        } else {
          $('.details-user').removeClass('show');
          $('.content-files').removeClass('hien');
          this.kt = 1;
        }
      }
    });
  }
  // đóng thông tin chi tiết user X
  closeDetailUsers() {
    if (this.kt === 1) {
      $('.details-user').addClass('show');
      $('.content-files').addClass('hien');
      this.kt = 2;
    } else {
      $('.details-user').removeClass('show');
      $('.content-files').removeClass('hien');
      this.kt = 1;
    }
  }

}
