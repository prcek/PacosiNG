import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICalendar, ICalendarEvent } from '../calendar.service';

@Component({
  selector: 'app-calendar-event-view',
  templateUrl: './calendar-event-view.component.html',
  styleUrls: ['./calendar-event-view.component.css']
})
export class CalendarEventViewComponent implements OnInit {
  @Input() calendar: ICalendar;
  @Input() event: ICalendarEvent;
  @Output() close = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  onClose() {
    this.close.emit();
  }
}
