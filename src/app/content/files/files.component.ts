import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';

import { FilesService } from '../../provider/files.service';
import { IFile } from '../../interface/IFile';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatSort, MatSortable } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
// import * as firebase from 'firebase';

import { DeleteFileService } from '../../provider/delete.service';
import { UserFireBaseService } from '../../provider/usersfirebase.service';
import { User } from '../../interface/user';
import { ThongTinUserService } from '../../provider/thongtinuser.service';
import { FolderComponent } from '../files/folder.component';
import { ShowAccountService } from '../../provider/showaccount.service';
import { FileData } from '../../interface/filedata';
import { ToastrService } from '../../provider/toastr.service';
import { AutheService } from '../../provider/authe.service';

declare var $: any;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  allFiles: any;
  statusDelete = false;
  stateUser = false;
  stateUserName = '';
  stateEmail = '';
  statePhotoURL = '';
  user: User[];
  idFolder: any;
  linkImage = '';
  checkCloseUser = '';
  nameDelete = '';
  checkStateProgress = false;
  fileData: FileData[]; // mảng chứa data đổ từ server xuống, thực hiện tìm kiếm folder/file theo id trên server
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
    private toaStrService: ToastrService,
    private activateRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    private authe: AutheService,
  ) { }

  ngOnInit() {
    this.paramsFunction();
    this.fileService.getThongTinSearch().subscribe(data => {
      // Load data với kết quá search được
      this.allFiles = new MatTableDataSource(data);
      this.allFiles.sort = this.sort;
    });
    this.checkValueInputSearch();
    this.reLoadFiles();
    this.userLogin();
    this.showAccount();
    this.intervalData();
  }

  public intervalData() {
    const getData = Observable.interval(2500).subscribe(() => {
      this.fileService.getFile(this.parentId).subscribe(data => {
        this.allFiles = new MatTableDataSource(data);
      });
    });
  }

  // load file khi truy cap vao parentID (params thay doi)
  public paramsFunction() {
    this.activateRoute.params.subscribe(() => {
      let params = this.activateRoute.snapshot.params.folderId + '';
      params = params.slice(0, params.lastIndexOf('.'));
      this.parentId = +params || 0;
      this.loadFiles();
      console.log(params);
    });
  }

  // Conver URL
  public convertURL_Slug(str) {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
  }

  openFolder(row: any, typeFile: any) {
    if (typeFile === 'folder') {
      this.router.navigate(['root', this.convertURL_Slug(row.name), row.id + '.html']);
    }
  }

  checkValueInputSearch() {
    // Kiểm tra giá trị trong thẻ input -search
    this.fileService.getValueSearchNull().subscribe(valueInputSearch => {
      const strSearch = valueInputSearch;
      // Nếu giá trị search = '' thì load data với parentID = 0
      if (strSearch === '') {
        this.paramsFunction();
      }
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

  // Click tệp => reload trang
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
      width: '420px',
    });
    this.fileService.nameFolder('');
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(folderName => {
          this.fileService.getAllFile().subscribe(data => {
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

              this.fileService.addFolder(newFolder).subscribe();
            } else {
              this.fileService.getFile(this.parentId).subscribe(dataParent => {
                this.allFiles = new MatTableDataSource(dataParent);
              });
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
      width: '420px',
    });
    this.fileService.nameFolder('');
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getAllFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === fileName.toLowerCase() || fileName === '') {
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
                parentId: this.parentId,
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile(this.parentId).subscribe(dataParent => {
                  this.allFiles = new MatTableDataSource(dataParent);
                });
                this.toaStrService.Success('Thêm file thành công !');
              });
            } else {
              this.fileService.getFile(this.parentId).subscribe(dataParent => {
                this.allFiles = new MatTableDataSource(dataParent);
              });
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
      width: '420px',
    });
    this.fileService.nameFolder('');
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getAllFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === fileName.toLowerCase() || fileName === '') {
                checkName = false; // tên folder đã tồn tại => trả về false
              }
            });
            // nếu tên folder chưa tồn tại => true => thêm folder
            if (checkName === true) {
              const newFolder: IFile = {
                name: fileName,
                type: 'xlxs',
                date: new Date(Date.now()),
                daterepair: new Date(Date.now()),
                parentId: this.parentId,
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile(this.parentId).subscribe(dataParent => {
                  this.allFiles = new MatTableDataSource(dataParent);
                });
                this.toaStrService.Success('Thêm file thành công !');
              });
            } else {
              this.fileService.getFile(this.parentId).subscribe(dataParent => {
                this.allFiles = new MatTableDataSource(dataParent);
              });
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
      width: '420px',
    });
    this.fileService.nameFolder('');
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getAllFile().subscribe(data => {
            this.allFiles = data;
            // kiểm tra tên folder đã tồn tại chưa
            let checkName = true;
            this.allFiles.forEach(e => {
              if (e.name.toLowerCase() === fileName.toLowerCase() || fileName === '') {
                checkName = false; // tên folder đã tồn tại => trả về false
              }
            });
            // nếu tên folder chưa tồn tại => true => thêm folder
            if (checkName === true) {
              const newFolder: IFile = {
                name: fileName,
                type: 'pptx',
                date: new Date(Date.now()),
                daterepair: new Date(Date.now()),
                parentId: this.parentId,
              };
              this.fileService.addFolder(newFolder).subscribe(() => {
                this.fileService.getFile(this.parentId).subscribe(dataParent => {
                  this.allFiles = new MatTableDataSource(dataParent);
                });
                this.toaStrService.Success('Thêm file thành công !');
              });
            } else {
              this.fileService.getFile(this.parentId).subscribe(dataParent => {
                this.allFiles = new MatTableDataSource(dataParent);
              });
              this.toaStrService.Error('Tên file nhập đã trùng. Vui lòng kiểm tra lại !');
            }
          });
        });
        subscription.unsubscribe();
      }
    });
  }


  public async onChooseFolder(event) {

    if ('getFilesAndDirectories' in event) {
      await event.getFilesAndDirectories();
      return;
    }

    const files = Array.from(event.target.files) as File[];
    if (files.length === 0) {
      return 0;
    }
    for (const file of files) {

      const uploadTask = this.storage.upload(`uploads/${file.name}`, file);

      document.getElementById('stateProgress').style.opacity = '1';

      // wait for upload done
      await uploadTask.then();
      const percentage = +(uploadTask.task.snapshot.bytesTransferred / uploadTask.task.snapshot.totalBytes) * 100;
      document.getElementById('uploader').style.width = percentage + '%';
      // check state upload task
      if (uploadTask.task.snapshot.state === 'success') {

        if (percentage === 100) {
          document.getElementById('uploader').innerText = 'Tải lên thành công ...';

          // hidden progress after 5s
          setTimeout(() => {
            document.getElementById('stateProgress').style.opacity = '0';
          }, 5000);
        }

        // lấy type file
        const typeFile = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length);
        // lấy tên file
        const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
        const newImage: IFile = {
          name: fileName,
          type: typeFile,
          parentId: this.parentId,
          date: new Date(Date.now()),
          daterepair: new Date(Date.now()),
          linkDownload: uploadTask.task.snapshot.downloadURL,
        };
        this.fileService.addFolder(newImage).subscribe(() => {
          this.fileService.getFile(this.parentId).subscribe(data => {
            this.allFiles = new MatTableDataSource(data);
            this.allFiles.sort = this.sort;
          });
        });
      }
      // console.log(uploadTask.task.snapshot.downloadURL);

    }
  }

  public async onChooseFile(event) {
    const file = event.target.files[0];

    const uploadTask = this.storage.upload(`uploads/${file.name}`, file);
    document.getElementById('stateProgress').style.opacity = '1';
    // await for update done
    await uploadTask.then();

    // check state upload task
    const percentage = +(uploadTask.task.snapshot.bytesTransferred / uploadTask.task.snapshot.totalBytes) * 100;
    document.getElementById('uploader').style.width = percentage + '%';


    if (uploadTask.task.snapshot.state === 'success') {

      if (percentage === 100) {
        document.getElementById('uploader').innerText = 'Tải lên thành công ...';

        // hidden progress after 5s
        setTimeout(() => {
          document.getElementById('stateProgress').style.opacity = '0';
        }, 5000);
      }

      // lấy type file
      const typeFile = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length);
      // lấy tên file
      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
      const newImage: IFile = {
        name: fileName,
        type: typeFile,
        parentId: this.parentId,
        date: new Date(Date.now()),
        daterepair: new Date(Date.now()),
        linkDownload: uploadTask.task.snapshot.downloadURL,
      };
      this.fileService.addFolder(newImage).subscribe(() => {
        this.fileService.getFile(this.parentId).subscribe(data => {
          this.allFiles = new MatTableDataSource(data);
        });
      });
    }
  }

  renameFolder() {
    const dialogRef = this.diaLog.open(FolderComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        const subscription = this.fileService.getNameFolder().subscribe(fileName => {
          this.fileService.getAllFile().subscribe(data => {
            // mảng filData chứa data từ server
            this.fileData = data;
            const subscriptionRename = this.fileService.getIdFolder().subscribe(dataID => {
              // mảng filData chứa data từ server, chứa id của từng object => duyệt mảng để xóa đúng folder chọn
              this.fileData.forEach(items => {
                if (items.id === dataID) {
                  items.name = fileName;
                  items.daterepair = new Date(Date.now());
                  this.fileService.updateNameFolder(items, dataID).subscribe(() => {
                    this.fileService.getFile(this.parentId).subscribe(datFolder => {
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
    this.nameDelete = `${dataRow.name}.${dataRow.type}`;

  }

  deleteFolder() {
    let check = 0;
    let checkFirebase = 0;
    this.fileService.getAllFile().subscribe(data => {
      this.fileData = data;
      for (let index = 0; index < this.fileData.length; index++) {
        if (this.idFolder === this.fileData[index].id) {
          check = 1;
          if (this.fileData[index].linkDownload !== undefined) {
            checkFirebase = 1;
          }
        }
      }
      if (check === 1 && checkFirebase === 0) {
        this.fileService.deleteFolder(this.idFolder).subscribe(() => {
          this.fileService.getFile(this.parentId).subscribe(dataParentId => {
            this.allFiles = new MatTableDataSource(dataParentId);
          });
          this.toaStrService.Success('Delete file successful');
        });
      }
      if (check === 1 && checkFirebase === 1) {
        this.fileService.deleteFolder(this.idFolder).subscribe(() => {
          this.fileService.getFile(this.parentId).subscribe(dataParentId => {
            this.allFiles = new MatTableDataSource(dataParentId);
          });
        });
        const desertRef = this.storage.ref(`uploads/${this.nameDelete}`);
        desertRef.delete().toPromise().then(() => {
          this.toaStrService.Success('Delete file successful');
        }).catch(error => {
          console.log(error);
        });

      }
    });

  }

  // check row được chọn và đánh dấu để xóa
  changeStatus() {
    this.statusDelete = false;
    this.deleteService.statusDelete(this.statusDelete);
    $('.statusDelete').removeClass('active');
  }

  // lấy thông tin của user đăng nhập vào để hiển thị chi tiết thông tin user
  userLogin() {
    this.stateUser = true;
    this.stateUserName = sessionStorage.getItem('userName');
    this.stateEmail = sessionStorage.getItem('userEmail');
  }

  // logOut() {
  //   firebase.auth().signOut().then(result => {
  //     console.log('Logout success');
  //   }).catch(err => {
  //     console.log(err);
  //   });
  //   this.router.navigate(['/']);
  //   sessionStorage.clear();
  //   this.authe.isLogin = false;
  // }

  // đóng-mở thông tin chi tiết của user
  showAccount() {
    this.showAcc.getShowAccount().subscribe(showIFUser => {
      const strCheck = showIFUser;
      if (this.authe.isLogin === true) {
        if (strCheck === 'show') {
          $('.details-user').addClass('show');
          $('.content-files').addClass('hien');
        } else if (strCheck === 'hidden') {
          $('.details-user').removeClass('show');
          $('.content-files').removeClass('hien');
        }
        this.checkCloseUser = strCheck;
      }

    });
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
        if (element.id === row.id) {
          this.linkImage = element.linkDownload;
        }
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
