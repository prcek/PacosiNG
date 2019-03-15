import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { IUser, UserService } from '../user.service';
import { ICalendar } from '../calendar.service';

export interface Role {
  value: string;
  viewValue: string;
}

export const passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const p1 = control.get('password');
  const p2 = control.get('password_copy');
  return p1 && p2 && (p1.value || p2.value) && (p1.value !== p2.value) ? {'invalidPassword': true} : null;
};


@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<IUser>(true);
  @Input() all_calendars:  ICalendar[];
  @Input() user: IUser;
  @Input() new_mode: boolean;
  hide1 = true;
  hide2 = true;
  roles: Role[] = [
    {value: 'super', viewValue: 'Správce'},
    {value: 'view', viewValue: 'Zobrazení'},
    {value: 'edit', viewValue: 'Evidence'},
    {value: 'setup_ot', viewValue: 'Plánování'},
  ];

  userForm = new FormGroup({
    login: new FormControl({value: '', disabled: true}),
    name: new FormControl('', {validators: Validators.required}),
    password: new FormControl(''),
    password_copy: new FormControl(''),
    root: new FormControl(false),
    roles: new FormControl([], {validators: Validators.required}),
    calendar_ids: new FormControl([], {validators: Validators.required}),
  }, { validators: passwordValidator });
  error_msg: string;
  submitted = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('UserEditorComponent.ngOnInit', this.user);
    if (this.new_mode) {
      this.userForm.get('login').enable();
      this.userForm.get('password').setValidators(Validators.required);
      this.userForm.get('password_copy').setValidators(Validators.required);
    } else {
      this.userForm.setValue({
        login: this.user.login,
        name: this.user.name,
        root: this.user.root,
        roles: this.user.roles,
        calendar_ids: this.user.calendar_ids,
        password: null,
        password_copy: null
      });
    }
  }
  onSubmit() {
    if (this.new_mode) {
      const nu: IUser = {...this.userForm.getRawValue()};
      this.submitted = true;
      this.userForm.disable();
      this.error_msg = null;
      console.log('UserEditorComponent.onSubmit (newmode)', nu);
      this.userService.createUser(nu).subscribe((r) => {
        this.saved.emit(r);
        this.submitted = false;
        this.userForm.enable();
      }, (err) => {
        this.submitted = false;
        this.userForm.enable();
        this.error_msg = err;
      });
    } else {
      const uu: IUser = this.userForm.getRawValue();
      this.submitted = true;
      this.userForm.disable();
      this.error_msg = null;
      console.log('UserEditorComponent.onSubmit', uu);
      this.userService.updateUser(uu).subscribe((r) => {
        this.saved.emit(r);
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
}
