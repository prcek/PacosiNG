import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICalendar, IOpeningHoursTemplate, CalendarService } from '../calendar.service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, FormGroupDirective } from '@angular/forms';
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
  @Output() saved = new EventEmitter<IOpeningHoursTemplate>();
  week_days = ALL_WEEK_DAYS;
  submitted = false;
  error_msg: string;

  ohtForm = new FormGroup({
    week_day: new FormControl(null, { validators: Validators.required}),
    time: new FormControl(null, { validators: Validators.required}),
    time_end: new FormControl(null, { validators: Validators.required}),
  }, { validators: timeIntervalValidator });

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    if (!this.calendar) {
      throw Error('A CalendarOhtEditorComponent without calendar');
    }
    // this.ohtForm.setValidators(timeIntervalValidator);
  }
  onSubmit(formDirective: FormGroupDirective) {


    const t: IOpeningHoursTemplate = {
      _id: null,
      calendar_id: this.calendar._id,
      week_day: this.ohtForm.value.week_day,
      begin: this.ohtForm.value.time,
      len: this.ohtForm.value.time_end - this.ohtForm.value.time,
    };
    this.submitted = true;
    this.ohtForm.disable();
    this.error_msg = null;
    console.log('CalendarOhtEditorComponent.onSubmit', t);
    this.calendarService.createOpeningHourTemplate(t).subscribe((r) => {
      this.saved.emit(r);
      this.submitted = false;
      formDirective.resetForm();
      this.ohtForm.reset();
      this.ohtForm.enable();
      this.saved.emit(r);
    }, (err) => {
      this.submitted = false;
      this.ohtForm.enable();
      this.error_msg = err;
    });

  }

}
