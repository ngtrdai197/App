import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { AutheGuard } from './provider/authe.guard';
import { AutheService } from './provider/authe.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { FilesComponent } from './content/files/files.component';
import { FileslistComponent } from './content/files/fileslist/fileslist.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { RegisterComponent } from './register/register.component';
import { MenuBarComponent } from './content/menu-bar/menu-bar.component';
import { HeaderComponent } from './content/header/header.component';
import { FilesService } from './provider/files.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from './register/register.service';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FolderComponent } from './content/files/folder.component';
import { ThongTinUserService } from './provider/thongtinuser.service';
import {MatTableModule} from '@angular/material/table';
import { DeleteFileService } from './provider/delete.service';
import { UserFireBaseService } from './provider/usersfirebase.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';

const appRoutes: Routes = [
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: ContentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  {
    canActivate: [AutheGuard],
    path: 'content',
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
    FolderComponent
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
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FolderComponent,
  ]
})
export class AppModule { }
