import { Component, OnInit } from '@angular/core';
import { IUserInfo } from '../auth.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
  users: IUserInfo[] = [
    {login: 'admin', sudo: true, roles: ['super', 'view', 'edit']},
    {login: 'guest', sudo: false, roles: ['view']},
  ];
  displayedColumns: string[] = ['login', 'sudo', 'roles', 'actions'];
  constructor() { }

  ngOnInit() {
  }

}
