import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';


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
import { FormsModule } from '@angular/forms';


const appRoutes: Routes = [
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
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
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AutheGuard,
    AutheService,
    FilesService,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
