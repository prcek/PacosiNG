import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, IUserInfo, IUserContextInfo } from '../auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  user: IUserInfo;
  userContext: IUserContextInfo;
  userSubs: Subscription;
  userContextSubs: Subscription;
  dev_mode: boolean;
  constructor(private auth: AuthService, private router: Router) {
    this.dev_mode = ! environment.production;
  }

  ngOnInit() {
    this.user = this.auth.userInfo;
    this.userContext = this.auth.userContextInfo;

    this.auth.userInfo$.subscribe({
      next: (v) => { this.user = v; console.log('main-menu new user', v); }
    });

    this.auth.userContextInfo$.subscribe({
      next: (v) => { this.userContext = v; console.log('main-menu new user context', v); }
    });

  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.userContextSubs.unsubscribe();
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
