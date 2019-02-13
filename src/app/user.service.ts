import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap, map, filter, tap, delay, switchMapTo} from 'rxjs/operators';


export interface IUser {
  login: string;
  name: string;
  sudo: boolean;
  password?: string;
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
    console.log('UserService.getUsers');
    return this.apollo.query<{users: IUser[]}>({
      query: gql`{ users {login name sudo roles}}`,
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.users));
  }
  getUser(login: string): Observable<IUser> {
    return this.getUsers().pipe(switchMap(u => u), filter(u => u.login === login));
  }
  updateUser(user: IUser): Observable<IUser> {
    return this.apollo.mutate<{updateUser: IUser}, IUser>({
      mutation: gql`
        mutation($login: String! $password: String $name: String $sudo: Boolean $roles: [String]) {
          updateUser(login: $login password: $password name: $name sudo: $sudo roles: $roles) { login name sudo roles }
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
        mutation($login: String! $password: String! $name: String! $sudo: Boolean! $roles: [String]!) {
          createUser(login: $login password: $password name: $name sudo: $sudo roles: $roles) { login name sudo roles }
        }
      `,
      variables: {
        ...user
      }
    }).pipe(tap(r => console.log('UserService.createUser res=', r)),  map(res => res.data.createUser));
  }


}
