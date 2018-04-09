import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { AutheGuard } from './authe.guard';
import { AutheService } from './authe.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { FilesComponent } from './files/files.component';
import { FileslistComponent } from './files/fileslist/fileslist.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';

const appRoutes: Routes = [
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: 'content', component: ContentComponent },
  // { path: '', component: AppComponent },
  {
    canActivate: [AutheGuard],
    path: 'files',
    component: FilesComponent,
    children: [
      { path: 'folder/:folderName', component: FileslistComponent },
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
    ContentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AutheGuard, AutheService],
  bootstrap: [AppComponent]
})
export class AppModule { }
