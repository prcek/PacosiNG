import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, IUser } from '../user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
  users: IUser[];
  displayedColumns: string[] = ['login', 'sudo', 'roles', 'actions'];
  constructor(private router: Router, private userService: UserService) { }
  ngOnInit() {
    this.getUsers();
  }
  getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users);
  }
  onEdit(user: IUser) {
    this.router.navigate(['/users/' + user.login]);
  }

}
