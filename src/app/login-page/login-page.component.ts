import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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
  error = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAuth = this.auth.isAuth();
    this.form.password = '';
  }

  onSubmit() {
    this.submitted = true;
    this.error = false;
    this.auth.doLogin(this.form.login, this.form.password).subscribe(res => {
       this.submitted = false;
       console.log('login result (login form) is ', res);
       if (res) {
        this.router.navigate(['/']);
       } else {
         this.error = true;
       }
    });
  }
  get diagnostic() { return JSON.stringify({form: this.form, submitted: this.submitted, isAuth: this.isAuth}); }

}
