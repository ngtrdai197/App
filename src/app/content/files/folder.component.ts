import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { FilesService } from '../../provider/files.service';
import { log } from 'util';



@Component({
  selector: 'app-folder',
  template: `
      <h2 mat-dialog-title>Thư mục</h2>
      <mat-form-field>
      <input id="folderName" #folder [(ngModel)]="dataFolder" matInput placeholder="Nhập tên thư mục của bạn ...">
    </mat-form-field>
    <mat-dialog-actions>
      <button mat-button mat-raised-button [mat-dialog-close]="false">No</button>
      <button mat-button mat-raised-button color="primary" [mat-dialog-close]="true"
      (click)="getName(folder.value)">Yes</button>
    </mat-dialog-actions>
    `
})

export class FolderComponent implements OnInit {
  dataFolder: any; // lấy giá trị của thẻ input
  constructor(private dialogRef: MatDialogRef<FolderComponent>, private fileService: FilesService) { }
  ngOnInit() {
    this.renameData();
  }
  getName(nameFolder) {
    this.fileService.nameFolder(nameFolder);
    nameFolder = '';
  }

  renameData() {
    // đưa tên folder cần rename lên thẻ input để hiển thị
    const subscribe = this.fileService.getNameFolder().subscribe(data => {
      this.dataFolder = data;
    });
    subscribe.unsubscribe();
  }
}
