import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, IUser } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
  users: IUser[];
  displayedColumns: string[] = ['login', 'name', 'root', 'roles', 'actions'];
  constructor(private router: Router, private userService: UserService, private auth: AuthService) { }
  ngOnInit() {
    this.getUsers();
  }
  getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users);
  }
  onEdit(user: IUser) {
    this.router.navigate(['/users/edit/' + user.login]);
  }
  onSu(user: IUser) {
    this.auth.doSu(user.login).subscribe(res => {
      console.log('login result (login form) is ', res);
       if (res) {
        this.router.navigate(['/']);
       } else {
         alert('can\'t su!');
       }
    });
  }

}
