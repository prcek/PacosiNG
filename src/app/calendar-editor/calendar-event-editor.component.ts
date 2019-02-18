import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendarEvent, ICalendar, ICalendarEventType } from '../calendar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    name: new FormControl('', { validators: Validators.required}),
    color: new FormControl('', { validators: Validators.required}),
    begin: new FormControl(0, { validators: Validators.required}),
    len: new FormControl(0, { validators: Validators.required}),
  });
  error_msg: string;
  submitted = false;


  constructor() { }

  ngOnInit() {
    console.log('CalendarEventEditorComponent.ngOnInit', this.event);
    if (this.new_mode) {

    } else {
      this.eventForm.setValue({
        name: this.event.name,
        color: this.event.color,
        begin: this.event.begin,
        len: this.event.len
      });
    }
  }

}
