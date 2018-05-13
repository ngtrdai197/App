import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { AutheGuard } from './provider/authe.guard';
import { AutheService } from './provider/authe.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ToastrService } from './provider/toastr.service';


import { AppComponent } from './app.component';
import { FilesComponent } from './content/files/files.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { RegisterComponent } from './register/register.component';
import { MenuBarComponent } from './content/menu-bar/menu-bar.component';
import { HeaderComponent } from './content/header/header.component';
import { FilesService } from './provider/files.service';
import { RegisterService } from './register/register.service';
import { LoginComponent } from './login/login.component';
import { FolderComponent } from './content/files/folder.component';
import { ThongTinUserService } from './provider/thongtinuser.service';
import { DeleteFileService } from './provider/delete.service';
import { UserFireBaseService } from './provider/usersfirebase.service';
import { ShowAccountService } from './provider/showaccount.service';
import { appRoutes } from './app.routes';
import { FiledetailsComponent } from './content/filedetails/filedetails.component';



@NgModule({
  declarations: [
    AppComponent,
    FilesComponent,
    HomeComponent,
    ContentComponent,
    RegisterComponent,
    MenuBarComponent,
    HeaderComponent,
    LoginComponent,
    FolderComponent,
    FiledetailsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatSortModule,
    AngularFireStorageModule,
  ],
  providers: [
    AutheGuard,
    AutheService,
    FilesService,
    HttpClient,
    RegisterService,
    ThongTinUserService,
    DeleteFileService,
    UserFireBaseService,
    ShowAccountService,
    ToastrService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FolderComponent,
  ]
})
export class AppModule { }
