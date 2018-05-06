import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { AutheGuard, ReverseAutheGuard } from './provider/authe.guard';
import { AutheService } from './provider/authe.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { ToastrService } from './provider/toastr.service';


import { AppComponent } from './app.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { FilesComponent } from './content/files/files.component';
import { FileslistComponent } from './content/files/fileslist/fileslist.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { RegisterComponent } from './register/register.component';
import { MenuBarComponent } from './content/menu-bar/menu-bar.component';
import { HeaderComponent } from './content/header/header.component';
import { FilesService } from './provider/files.service';
import { RegisterService } from './register/register.service';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { FolderComponent } from './content/files/folder.component';
import { ThongTinUserService } from './provider/thongtinuser.service';
import { DeleteFileService } from './provider/delete.service';
import { UserFireBaseService } from './provider/usersfirebase.service';
import { ShowAccountService } from './provider/showaccount.service';

const appRoutes: Routes = [
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  {
    canActivate: [AutheGuard],
    path: 'file_root',
    component: ContentComponent,
    children: [
      {
        path: 'files',
        component: FilesComponent,
        children: [
          { path: 'folder/:folderName', component: FileslistComponent },
        ]
      }
    ]
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    FilesComponent,
    FileslistComponent,
    HomeComponent,
    ContentComponent,
    RegisterComponent,
    MenuBarComponent,
    HeaderComponent,
    UserComponent,
    LoginComponent,
    FolderComponent,
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
  ],
  providers: [
    AutheGuard,
    ReverseAutheGuard,
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
