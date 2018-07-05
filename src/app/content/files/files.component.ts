import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';

import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatSort, MatSortable } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
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
  sttKeyUp: any;
  linkImage = '';
  // Menu right = false => ẩn đi
  kt = 1; // kiểm tra để ẩn hiện chi tiết user
  fileData: FileData[]; // mảng chứa data đổ từ server xuống, thực hiện tìm kiếm folder/file theo id trên server
  recycleBinTemp: IFile[];
  displayedColumns = ['name', 'date', 'type', 'daterepair'];
  @ViewChild(MatSort) sort: MatSort;

  private parentId = 0;

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
    private activateRoute: ActivatedRoute,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.paramsFunction();

    this.loadFiles();
    this.reLoadFiles();
    this.fileService.getThongTinSearch().subscribe(data => {
      this.allFiles = new MatTableDataSource(data);
      this.allFiles.sort = this.sort;
    });
    this.userLogin();
    this.showAccount();
  }
  // load file khi truy cap vao parentID (params thay doi)
  paramsFunction() {
    this.activateRoute.params.subscribe(params => {
      // this.parentId = +params.get('folderId') || 0;
      this.parentId = params['folderId'];

      this.loadFiles();
    });
  }

  loadFiles() {
    this.fileService.getFile(this.parentId).subscribe(data => {
      this.allFiles = new MatTableDataSource(data);
    });
    // load files recyclebin
    this.deleteService.getStatusRecycleBin().subscribe(stt => {
      const _kt = stt;
      if (_kt === true) {
        this.fileService.getRecycleBin().subscribe(data => {
          this.allFiles = new MatTableDataSource(data);
        });
      }
    });

  }

  reLoadFiles() {
    this.deleteService.getStatusAllFiles().subscribe(stt => {
      const _kt = stt;
      if (_kt === true) {
        this.fileService.getFile(this.parentId).subscribe(data => {
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
    this.fileService.nameFolder('');
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(folderName => {
          this.fileService.getFile(this.parentId).subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if ((e.name.toLowerCase() === folderName.toLowerCase()) || folderName === '') {
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
                parentId: this.parentId,
              };

              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile(this.parentId).subscribe(data => {
                  this.allFiles = new MatTableDataSource(data);
                  this.allFiles.sort = this.sort;
                });
                this.toaStrService.Success('Thêm folder thành công !')
              });
            } else {
              this.toaStrService.Error('Tên folder nhập không hợp lệ. Kiểm tra lại !');
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
    this.fileService.nameFolder('');
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
    this.fileService.nameFolder('');
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
    this.fileService.nameFolder('');
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
                      this.fileService.nameFolder('');
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
      this.fileService.nameFolder('');
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
      this.autheService.logOut();
      localStorage.removeItem('currentUser');
      this.router.navigate(['home']);
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

  openFolder(id: any) {
    this.router.navigate(['/file_root', id]);
  }

  public async onChooseFile(event) {
    console.log(event);

    if ('getFilesAndDirectories' in event) {
      console.log(await event.getFilesAndDirectories());
      return;
    }

    const files = Array.from(event.target.files) as File[];
    if (files.length === 0) {
      return 0;
    }
    for (const file of files) {
      console.log(file);
      console.log(file.name);

      const uploadTask = this.storage.upload(`uploads/${file.name}`, file);
      // wait for upload done
      console.log(await uploadTask.then());

      // tao file va luu vao db cua minh
      // name,  parentId
      // downloadUurlk
      console.log(uploadTask.task.snapshot);
      if (uploadTask.task.snapshot.state === 'success') {
        const newImage: IFile = {
          name: file.name,
          type: 'image',
          parentId: this.parentId,
          date: new Date(Date.now()),
          daterepair: new Date(Date.now()),
          linkDownload: uploadTask.task.snapshot.downloadURL,
        };
        this.fileService.addFolder(newImage).subscribe(() => {
          this.fileService.getFile().subscribe(data => {
            this.allFiles = new MatTableDataSource(data);
            this.allFiles.sort = this.sort;
          });
        });
      }
      // console.log(uploadTask.task.snapshot.downloadURL);

    }
  }

  public onLeftClick() {
    // event.preventDefault();
    $('.menu-right').removeClass('menu-right-active');
  }
  public onRightClick(event, row) {
    // lấy link download của file
    this.fileService.getAllFile().subscribe(data => {
      const temp = data;
      temp.forEach(element => {
        
      });
    });
    // console.log('run');
    event.preventDefault();
    // width menu bar = 212px
    const locateX = event.pageX - 212;
    // height header = 100px
    const locateY = event.pageY - 100;
    $('.menu-right').addClass('menu-right-active');
    $('.menu-right-active').css('top', locateY);
    $('.menu-right-active').css('left', locateX);

  }
}
