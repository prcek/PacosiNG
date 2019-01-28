import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  isAuth: boolean;
  form = {
    login: '',
    password: ''
  };

  submitted = false;
  hide = true;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isAuth = this.auth.isAuth();
    this.form.password = '';
  }

  onSubmit() {
    this.submitted = true;
    // this.authService.doLogin('x', 'y').subscribe(res => {
    //   this.submitted = false;
    //   console.log('login result (login form) is ', res);
    // });
  }
  get diagnostic() { return JSON.stringify({form: this.form, submitted: this.submitted, isAuth: this.isAuth}); }

}
