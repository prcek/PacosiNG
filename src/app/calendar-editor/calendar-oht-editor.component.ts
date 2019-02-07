import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICalendar, IOpeningHoursTemplate } from '../calendar.service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { WeekDay, ALL_WEEK_DAYS } from './common';


export const timeIntervalValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const time = control.get('time');
  const time_end = control.get('time_end');
  return time && time_end && time.valid && time_end.valid && time_end.value <= time.value ? {'invalidInterval': true} : null;
};

@Component({
  selector: 'app-calendar-oht-editor',
  templateUrl: './calendar-oht-editor.component.html',
  styleUrls: ['./calendar-oht-editor.component.css']
})
export class CalendarOhtEditorComponent implements OnInit {
  @Input() calendar: ICalendar;
  @Output() new_oht = new EventEmitter<IOpeningHoursTemplate>();
  week_days = ALL_WEEK_DAYS;
  submitted = false;

  ohtForm = new FormGroup({
    week_day: new FormControl(null, { validators: Validators.required}),
    time: new FormControl(null, { validators: Validators.required}),
    time_end: new FormControl(null, { validators: Validators.required}),
  }, { validators: timeIntervalValidator });

  constructor() { }

  ngOnInit() {
    if (!this.calendar) {
      throw Error('A CalendarOhtEditorComponent without calendar');
    }
    // this.ohtForm.setValidators(timeIntervalValidator);
  }
  onSubmit() {
    this.new_oht.emit({
      _id: null,
      calendar_id: '1',
      week_day: 1,
      begin: 1,
      len: 2
    });
  }

}
