import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContentComponent } from './content/content.component';
import { FilesComponent } from './content/files/files.component';
import { AutheGuard } from './provider/authe.guard';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

export const appRoutes: Routes = [
    { path: 'home', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
      path: 'file_root',
      component: ContentComponent,
      canActivate: [AutheGuard],
      children: [
        {
          path: '',
          component: FilesComponent,
        },
        {
          path: ':folderId',
          component: FilesComponent,
        },
        {
          path: ':folderId/:fileName',
          component: FilesComponent,
        }
      ] 
    },
    { path: '**', component: PagenotfoundComponent },
  ];