import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendar, CalendarService } from '../calendar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeekDay, ALL_WEEK_DAYS } from './common';




@Component({
  selector: 'app-calendar-editor',
  templateUrl: './calendar-editor.component.html',
  styleUrls: ['./calendar-editor.component.css']
})
export class CalendarEditorComponent implements OnInit {
  @Output() updated = new EventEmitter<ICalendar>();
  @Input() calendar: ICalendar;
  @Input() newMode: boolean;


  week_days = ALL_WEEK_DAYS;


  calendarForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required}),
    span: new FormControl(15, { validators: [Validators.required, Validators.min(5), Validators.max(60)]}),
    day_begin: new FormControl(7 * 4, { validators: [Validators.required, Validators.min(0), Validators.max(60)]}),
    day_len: new FormControl(10 * 4, { validators: [Validators.required, Validators.min(1), Validators.max(100)]}),
    week_days: new FormControl([1, 2, 3, 4, 5], {validators: Validators.required}),
  });
  error_msg: string;
  submitted = false;


  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    console.log('CalendarEditorComponent.ngOnInit', this.calendar);
    this.calendarForm.setValue({
      name: this.calendar.name,
      span: this.calendar.span,
      day_begin: this.calendar.day_begin,
      day_len: this.calendar.day_len,
      week_days: this.calendar.week_days,
    });
  }

  onSubmit() {
     // TODO: Use EventEmitter with form value
     const uc: ICalendar = {_id: this.calendar._id, ...this.calendarForm.getRawValue()};
     this.submitted = true;
     this.calendarForm.disable();
     this.error_msg = null;
     console.log('CalendarEditorComponent.onSubmit', uc);
     this.calendarService.updateCalendar(uc).subscribe((r) => {
       this.updated.emit(r);
       this.submitted = false;
       this.calendarForm.enable();
     }, (err) => {
       this.submitted = false;
       this.calendarForm.enable();
       this.error_msg = err;
     });
  }

}
