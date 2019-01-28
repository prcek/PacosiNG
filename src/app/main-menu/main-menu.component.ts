import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, IUserInfo } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  user: IUserInfo;
  userSubs: Subscription;
  dev_mode: boolean;
  constructor(private auth: AuthService, private router: Router) {
    this.dev_mode = ! environment.production;
  }

  ngOnInit() {
    this.user = this.auth.userInfo;
    this.userSubs = this.auth.userInfo$.subscribe({
      next: (v) => { this.user = v; console.log('main-menu new user', v); }
    });
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }

  onLogout() {
    console.log('logout button');
    this.auth.doLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  get isAuth(): boolean { return this.user ? true : false; }
  get login(): string { return this.user ? this.user.login : ''; }
}
