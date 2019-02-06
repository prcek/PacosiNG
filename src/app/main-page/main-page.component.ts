import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  form = {
    date: '',
    time: 5
  };
  submitted = false;
  disabled = false;
  constructor() { }

  ngOnInit() {
  }
  onSubmit() {}
  onTest() {
    this.disabled = !this.disabled;
  }
  get diagnostic() { return JSON.stringify({form: this.form, disabled: this.disabled }); }

}
