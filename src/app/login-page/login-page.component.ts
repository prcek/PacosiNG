import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  isAuth: boolean;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isAuth = this.auth.isAuth();
  }

}
