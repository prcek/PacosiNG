import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, IUserInfo } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  user: IUserInfo;
  userSubs: Subscription;
  constructor(private auth: AuthService) {

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

  get login(): string { return this.user ? this.user.login : 'no auth'; }
}
