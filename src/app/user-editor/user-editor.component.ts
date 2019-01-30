import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../user.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent implements OnInit {

  @Input() user: IUser;

  userForm = new FormGroup({
    login: new FormControl({value: '', disabled: true}),
    name: new FormControl({value: ''}, {validators: Validators.required}),
    sudo: new FormControl(false)
  });

  submitted = false;

  constructor() { }

  ngOnInit() {
    console.log('UserEditorComponent.ngOnInit', this.user);
    this.userForm.setValue({
      login: this.user.login,
      name: this.user.name,
      sudo: this.user.sudo,
    });
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.userForm.value);
  }
}
