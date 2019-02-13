import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { CalendarsPageComponent } from './calendars-page/calendars-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { CalendarOhPageComponent } from './calendar-page/calendar-oh-page.component';
import { CalendarOhtPageComponent } from './calendar-page/calendar-oht-page.component';
import { CalendarNewPageComponent } from './calendar-page/calendar-new-page.component';
import { UserNewPageComponent } from './user-page/user-new-page.component';


const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'main', canActivate: [AuthGuard], component: MainPageComponent },
  { path: 'users', canActivate: [AuthGuard], component: UsersPageComponent },
  { path: 'users/edit/:id', canActivate: [AuthGuard], component: UserPageComponent },
  { path: 'users/new', canActivate: [AuthGuard], component: UserNewPageComponent },

  { path: 'calendars', canActivate: [AuthGuard], component: CalendarsPageComponent },
  { path: 'calendars/edit/:id', canActivate: [AuthGuard], component: CalendarPageComponent },
  { path: 'calendars/oh/:id', canActivate: [AuthGuard], component: CalendarOhPageComponent },
  { path: 'calendars/oht/:id', canActivate: [AuthGuard], component: CalendarOhtPageComponent },
  { path: 'calendars/new', canActivate: [AuthGuard], component: CalendarNewPageComponent},
  { path: '',   redirectTo: '/main', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
