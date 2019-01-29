import { Injectable, Inject, Optional, PLATFORM_ID, InjectionToken } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';


import { Subject, Observable, of, timer } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { environment } from '../environments/environment';
import * as jwtdecode from 'jwt-decode';


interface ILoginVariables {
  login: string;
  password: string;
}
interface ILoginResponse {
  login: {
    ok: boolean;
    token: string;
    user: IUserInfo;
  };
}
interface IReloginResponse {
  relogin: {
    ok: boolean;
    token: string;
    user: IUserInfo;
  };
}

interface IDevToken {
  user: IUserInfo;
}

export interface IUserInfo {
  login: string;
  sudo: boolean;
  roles: string[];
}

const AUTH_USER_INFO_KEY = makeStateKey<IUserInfo>('auth_user_info');
export const AUTH_USER_INFO_TOKEN = new InjectionToken<IUserInfo>('auth_user_info');


function getCookie(name: string): string {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function setCookie(name: string, value: string, days: number = 30): void {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + '=' + value + ';path=/;expires=' + d.toUTCString();
}

function deleteCookie(name: string): void { setCookie(name, '', -1); }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private isServer: boolean;
  public redirectUrl: string;  // filled by auth guard (when redirecting to /login)
  private userInfoSource = new Subject<IUserInfo>();
  private tick$ = timer(10000, 5 * 60000);
  // private effectiveUserSource = new Subject<IUser>();
  userInfo$ = this.userInfoSource.asObservable();
  userInfo: IUserInfo;
  constructor(
    @Optional() @Inject(REQUEST) private req,
    @Optional() @Inject(AUTH_USER_INFO_TOKEN) private req_user_info,
    @Inject(PLATFORM_ID) platformId,
    private apollo: Apollo,
    private tstate: TransferState,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
    if (this.isServer) {
      if (this.req_user_info) {
        console.log('req_user_info ready', this.req_user_info);
        this.userInfo = this.req_user_info;
      }
      this.tstate.onSerialize(AUTH_USER_INFO_KEY, () => { console.log('AuthService.onSerialize', this.userInfo); return this.userInfo; });
    } else if (this.isBrowser) {
      if (environment.production) {
        console.log('AuthService.onDeSerialize', this.tstate.get(AUTH_USER_INFO_KEY, null));
        this.userInfo = this.tstate.get(AUTH_USER_INFO_KEY, null);
        this.tstate.remove(AUTH_USER_INFO_KEY);
      } else {
        console.log('Auth service (dev mode) init from cookie');
        const token = getCookie('auth');
        if (token) {
          try {
            const dt = <IDevToken>jwtdecode(token);
            console.log(dt);
            if (dt && dt.user) {
              this.userInfo = dt.user;
            }
          } catch (e) {
            console.log('can\'t decode token', token);
          }
        } else {
          console.log('auth token missing');
        }
      }
      this.tick$.pipe(
        // tap((x) => console.log('tap', x)),
        filter(() => this.isAuth()),
        // tap((x) => console.log('ftap', x)),
        switchMap(() => this.renewToken()),
        tap((x) => console.log('renew token result', x)),
        ).subscribe();
    }

  }

  renewToken(): Observable<boolean> {
    const x =  this.apollo.mutate<IReloginResponse>({
      mutation:  gql`
        mutation {
          relogin {
            ok
            token
            user {
              login
              sudo
              roles
            }
          }
        }
      `
    });

    return Observable.create((o) => {
      x.subscribe(r => {
        if (r.data && r.data.relogin && r.data.relogin.ok) {
          console.log('OK - relogin response', r.data.relogin);
          setCookie('auth', r.data.relogin.token);
          this.userInfo = r.data.relogin.user;
          this.userInfoSource.next(this.userInfo);
          o.next(true);
        } else {
          console.log('Failed - relogin response', r);
          o.next(false);
        }
        o.complete();
      }, err => {
        o.error(err);
        o.complete();
      });
    });
  }

  isAuth(): boolean {

    if (this.userInfo) {
      return true;
    }
/*
    if (this.isBrowser) {
      console.log('reading browser cookie');
      return (getCookie('auth') !== null);
    } else if (this.req) {
      console.log('reading request cookie');
      return this.req.cookies && (this.req.cookies.auth) ? true : false;
    }
  */
    return false;
  }

  doLogin(login: string, password: string): Observable<boolean> {
    const x =  this.apollo.mutate<ILoginResponse, ILoginVariables>({
      mutation:  gql`
        mutation($login: String!, $password: String!) {
          login(login:$login password:$password) {
            ok
            token
            user {
              login
              sudo
              roles
            }
          }
        }
      `,
      variables: {
        login,
        password
      }
    });
    return Observable.create((o) => {
      x.subscribe(r => {
        if (r.data && r.data.login && r.data.login.ok) {
          console.log('OK - login response', r.data.login);
          setCookie('auth', r.data.login.token);
          this.userInfo = r.data.login.user;
          this.userInfoSource.next(this.userInfo);
          o.next(true);
        } else {
          console.log('Failed - login response', r);
          o.next(false);
        }
        o.complete();
      }, err => {
        o.error(err);
        o.complete();
      });
    });
  }

  doLogout(): Observable<boolean> {
    deleteCookie('auth');
    this.userInfo = null;
    this.userInfoSource.next(null);
    return of(true);
  }
}
