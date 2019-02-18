import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendarEvent, ICalendar, ICalendarEventType } from '../calendar.service';

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
  constructor() { }

  ngOnInit() {
  }

}
