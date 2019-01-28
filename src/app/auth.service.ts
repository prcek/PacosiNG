import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformBrowser } from '@angular/common';


import { Subject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FetchResult } from 'apollo-link';

interface ILoginVariables {
  login: string;
  password: string;
}
interface ILoginResponse {
  login: {
    ok: boolean;
    token: string;
  };
}


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
  public redirectUrl: string;  // filled by auth guard (when redirecting to /login)
  constructor(
    @Optional() @Inject(REQUEST) private req,
    @Inject(PLATFORM_ID) platformId,
    private apollo: Apollo
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  isAuth(): boolean {
    if (this.isBrowser) {
      console.log('reading browser cookie');
      return (getCookie('auth') !== null);
    } else if (this.req) {
      console.log('reading request cookie');
      return this.req.cookies && (this.req.cookies.auth) ? true : false;
    }
    return false;
  }

  doLogin(login: string, password: string): Observable<boolean> {
    const x =  this.apollo.mutate<ILoginResponse, ILoginVariables>({
      mutation:  gql`
        mutation($login: String!, $password: String!) {
          login(login:$login password:$password) {
            ok
            token
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
}
