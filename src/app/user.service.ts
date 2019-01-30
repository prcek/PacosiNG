import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap, map, filter, tap} from 'rxjs/operators';


export interface IUser {
  login: string;
  name: string;
  sudo: boolean;
  roles: string[];
}

// const USERS: IUser[] = [
//   {login: 'admin', sudo: true, roles: ['super', 'view', 'edit']},
//   {login: 'guest', sudo: false, roles: ['view']},
// ];


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }
  getUsers(): Observable<IUser[]> {
    return this.apollo.query<{users: IUser[]}>({
      query: gql`{ users {login name sudo roles}}`
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.users));
  }
  getUser(login: string): Observable<IUser> {
    return this.getUsers().pipe(switchMap(u => u), filter(u => u.login === login));
  }
  updateUser(user: IUser): Observable<boolean> {
    return of(true);
  }
}
