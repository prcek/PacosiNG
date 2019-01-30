import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService, IUser } from '../user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: IUser;
  constructor(private route: ActivatedRoute, private location: Location, private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }
  getUser(): void {
    const login = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(login)
      .subscribe(user => this.user = user);
  }
  goBack(): void {
    this.location.back();
  }

}
