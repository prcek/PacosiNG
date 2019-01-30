import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface IUser {
  login: string;
  sudo: boolean;
  roles: string[];
}
const USERS: IUser[] = [
  {login: 'admin', sudo: true, roles: ['super', 'view', 'edit']},
  {login: 'guest', sudo: false, roles: ['view']},
];

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  getUsers(): Observable<IUser[]> {
    return of(USERS);
  }
  getUser(login: string): Observable<IUser> {
    return of(USERS.find(user => user.login === login));
  }
}
