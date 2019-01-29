import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { UsersPageComponent } from './users-page/users-page.component';


const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'main', canActivate: [AuthGuard], component: MainPageComponent },
  { path: 'users', canActivate: [AuthGuard], component: UsersPageComponent },
  { path: '',   redirectTo: '/main', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
