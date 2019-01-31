import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, UserService } from '../user.service';

export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent implements OnInit {
  @Output() updated = new EventEmitter<IUser>(true);
  @Input() user: IUser;
  roles: Role[] = [
    {value: 'super', viewValue: 'Super'},
    {value: 'view', viewValue: 'View'},
    {value: 'edit', viewValue: 'Edit'}
  ];

  userForm = new FormGroup({
    login: new FormControl({value: '', disabled: true}),
    name: new FormControl({value: ''}, {validators: Validators.required}),
    sudo: new FormControl(false),
    roles: new FormControl({value: []}, {validators: Validators.required}),
  });
  error_msg: string;
  submitted = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('UserEditorComponent.ngOnInit', this.user);
    this.userForm.setValue({
      login: this.user.login,
      name: this.user.name,
      sudo: this.user.sudo,
      roles: this.user.roles,
    });
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    const uu: IUser = this.userForm.getRawValue();
    this.submitted = true;
    this.userForm.disable();
    this.error_msg = null;
    console.log('UserEditorComponent.onSubmit', uu);
    this.userService.updateUser(uu).subscribe((r) => {
      this.updated.emit(r);
      this.submitted = false;
      this.userForm.enable();
      this.userForm.get('login').disable();
    }, (err) => {
      this.submitted = false;
      this.userForm.enable();
      this.userForm.get('login').disable();
      this.error_msg = err;
    });

  }
}
