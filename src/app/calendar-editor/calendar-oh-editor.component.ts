import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ICalendar, IOpeningHours, CalendarService } from '../calendar.service';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, FormGroupDirective } from '@angular/forms';
import * as R from 'ramda';
import * as M from 'moment';

export const timeIntervalValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const time = control.get('time');
  const time_end = control.get('time_end');
  return time && time_end && time.valid && time_end.valid && time_end.value <= time.value ? {'invalidInterval': true} : null;
};

export interface Day {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-calendar-oh-editor',
  templateUrl: './calendar-oh-editor.component.html',
  styleUrls: ['./calendar-oh-editor.component.css']
})
export class CalendarOhEditorComponent implements OnInit, OnChanges {
  @Input() calendar: ICalendar;
  @Input() day_list: string[];
  @Output() saved = new EventEmitter<IOpeningHours>();
  days: Day[];
  submitted = false;
  error_msg: string;
  ohForm = new FormGroup({
    day: new FormControl(null, { validators: Validators.required}),
    time: new FormControl(null, { validators: Validators.required}),
    time_end: new FormControl(null, { validators: Validators.required}),
  }, { validators: timeIntervalValidator });

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.days = R.map((i => ({value: i, viewValue: i})), this.day_list);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    const day_list = changes.day_list;
    if (day_list && !day_list.firstChange)  {
      this.days = R.map((i => ({value: i, viewValue: i})), this.day_list);
      this.ohForm.reset();
    }
  }
  onSubmit(formDirective: FormGroupDirective) {


    const t: IOpeningHours = {
      _id: null,
      calendar_id: this.calendar._id,
      day: M(this.ohForm.value.day).toDate(),
      begin: this.ohForm.value.time,
      len: this.ohForm.value.time_end - this.ohForm.value.time,
    };
    this.submitted = true;
    this.ohForm.disable();
    this.error_msg = null;
    console.log('CalendarOhEditorComponent.onSubmit', t);
    this.calendarService.createOpeningHours(t).subscribe((r) => {
      this.saved.emit(r);
      this.submitted = false;
      formDirective.resetForm();
      this.ohForm.reset();
      this.ohForm.enable();
      this.saved.emit(r);
    }, (err) => {
      this.submitted = false;
      this.ohForm.enable();
      this.error_msg = err;
    });

  }

}
