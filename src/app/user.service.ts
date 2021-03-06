import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap, map, filter, tap, delay, switchMapTo} from 'rxjs/operators';


export interface IUser {
  login: string;
  name: string;
  root: boolean;
  password?: string;
  roles: string[];
  calendar_ids: string[];
}



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }
  getUsers(): Observable<IUser[]> {
    console.log('UserService.getUsers');
    return this.apollo.query<{users: IUser[]}>({
      query: gql`{ users {login name root roles calendar_ids}}`,
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.users));
  }
  getUser(login: string): Observable<IUser> {
    return this.getUsers().pipe(switchMap(u => u), filter(u => u.login === login));
  }
  updateUser(user: IUser): Observable<IUser> {
    return this.apollo.mutate<{updateUser: IUser}, IUser>({
      mutation: gql`
        mutation($login: String! $password: String $name: String $root: Boolean $roles: [String] $calendar_ids: [String]) {
          updateUser(login: $login password: $password name: $name root: $root roles: $roles calendar_ids: $calendar_ids) {
            login name root roles calendar_ids
          }
        }
      `,
      variables: {
        ...user
      }
    }).pipe(tap(r => console.log('UserService.updateUser res=', r)),  map(res => res.data.updateUser));
  }

  createUser(user: IUser): Observable<IUser> {
    return this.apollo.mutate<{createUser: IUser}, IUser>({
      mutation: gql`
        mutation($login: String! $password: String! $name: String! $root: Boolean! $roles: [String]! $calendar_ids: [String]!) {
          createUser(login: $login password: $password name: $name root: $root roles: $roles calendar_ids: $calendar_ids) {
            login name root roles calendar_ids
          }
        }
      `,
      variables: {
        ...user
      }
    }).pipe(tap(r => console.log('UserService.createUser res=', r)),  map(res => res.data.createUser));
  }


}
