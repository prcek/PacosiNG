import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendarEvent, ICalendar, ICalendarEventType, CalendarService } from '../calendar.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as M from 'moment';
import * as R from 'ramda';

/*
export const timeIntervalValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const time = control.get('time');
  const time_end = control.get('time_end');
  return time && time_end && time.valid && time_end.valid && time_end.value <= time.value ? {'invalidInterval': true} : null;
};
*/

function overlapValidator(free_slots: number[], event_types: ICalendarEventType[]): ValidatorFn  {
  const v: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const begin = control.get('begin');
    const event_type_id = control.get('event_type_id');
    if (begin && begin.valid && event_type_id && event_type_id.valid) {
      const event_type = R.find<ICalendarEventType>(R.propEq('_id', event_type_id.value), event_types);
      if (!event_type) {
        return {'missing_event_type': true};
      }
      const bv = <number> begin.value;
      const required_slots =  R.range(bv, bv + event_type.len);
      const ct = R.contains(R.__, free_slots);
      if ( R.all(ct, required_slots) ) {
        return null;
      }
      return {'overlap': true};
    }


    return null;
  };
  return v;
}

@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css']
})
export class CalendarEventEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<ICalendarEvent>();
  @Input() calendar: ICalendar;
  @Input() event: ICalendarEvent;
  @Input() event_types: ICalendarEventType[];
  @Input() free_slots: number[];
  @Input() new_mode: boolean;
  @Input() new_day: Date;
  @Input() new_time: number;


  eventForm = new FormGroup({
    // name: new FormControl('', { validators: Validators.required}),
    begin: new FormControl(0, { validators: Validators.required}),
    event_type_id: new FormControl(null, { validators: Validators.required}),
    client: new FormGroup({
      last_name: new FormControl('', { validators: Validators.required}),
      first_name: new FormControl(''),
      year: new FormControl(null),
      phone: new FormControl(null),
    }),
    comment: new FormControl(''),
  });

  error_msg: string;
  submitted = false;


  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    console.log('CalendarEventEditorComponent.ngOnInit', this.event);

    if (this.new_mode) {
      this.eventForm.setValue({
        client: {
          last_name: '',
          first_name: '',
          year: null,
          phone: '',
        },
        event_type_id: null,
        begin: this.new_time,
        comment: ''
      });
    } else {

      this.eventForm.setValue({
        client: {
          last_name: this.event.client.last_name,
          first_name: this.event.client.first_name,
          year: this.event.client.year,
          phone: this.event.client.phone
        },
        event_type_id: this.event.event_type_id,
        begin: this.event.begin,
        comment: this.event.comment
      });
    }
    this.eventForm.setValidators(overlapValidator(this.free_slots, this.event_types));
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.new_mode) {
      const u: ICalendarEvent = {
        _id: null,
        calendar_id: this.calendar._id,
        day: M(this.new_day).utc().format('YYYY-MM-DD'),
        ...this.eventForm.getRawValue()
      };
      this.submitted = true;
      this.eventForm.disable();
      this.error_msg = null;
      console.log('CalendarEventEditorComponent.onSubmit', u);
      this.calendarService.createEvent(u).subscribe((r) => {
        this.saved.emit(r);
        this.submitted = false;
        this.eventForm.enable();
      }, (err) => {
        this.submitted = false;
        this.eventForm.enable();
        this.error_msg = err;
      });
    } else {

     const u: ICalendarEvent = {_id: this.event._id, day: this.event.day, ...this.eventForm.getRawValue()};
     this.submitted = true;
     this.eventForm.disable();
     this.error_msg = null;
     console.log('CalendarEventEditorComponent.onSubmit', u);
     this.calendarService.updateEvent(u).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       this.eventForm.enable();
     }, (err) => {
       this.submitted = false;
       this.eventForm.enable();
       this.error_msg = err;
     });
    }
 }
}
