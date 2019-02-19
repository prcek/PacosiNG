import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendarEvent, ICalendar, ICalendarEventType } from '../calendar.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css']
})
export class CalendarEventEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<ICalendarEvent>();
  @Input() calendar: ICalendar;
  @Input() event: ICalendarEvent;
  @Input() event_types: ICalendarEventType;
  @Input() new_mode: boolean;


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


  constructor() { }

  ngOnInit() {
    console.log('CalendarEventEditorComponent.ngOnInit', this.event);

    if (this.new_mode) {

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
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.new_mode) {
      /*
     const n: ICalendarEventType = {_id: null, calendar_id: this.calendar._id, ...this.etForm.getRawValue()};
     this.submitted = true;
     this.etForm.disable();
     this.error_msg = null;
     console.log('CalendarEtEditorComponent.onSubmit (newmode)', n);
     this.calendarService.createEventType(n).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       formDirective.resetForm();
       this.etForm.enable();
       this.etForm.reset();
     }, (err) => {
       this.submitted = false;
       this.etForm.enable();
       this.error_msg = err;
     });
     */
    } else {
      /*
     const u: ICalendarEventType = {_id: this.event_type._id, ...this.etForm.getRawValue()};
     this.submitted = true;
     this.etForm.disable();
     this.error_msg = null;
     console.log('CalendarEtEditorComponent.onSubmit', u);
     this.calendarService.updateEventType(u).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       this.etForm.enable();
     }, (err) => {
       this.submitted = false;
       this.etForm.enable();
       this.error_msg = err;
     });
     */
    }
 }
}
