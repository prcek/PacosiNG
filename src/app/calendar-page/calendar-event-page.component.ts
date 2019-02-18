import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent } from '../calendar.service';

@Component({
  selector: 'app-calendar-event-page',
  templateUrl: './calendar-event-page.component.html',
  styleUrls: ['./calendar-event-page.component.css']
})
export class CalendarEventPageComponent implements OnInit {
  calendar: ICalendar;
  event: ICalendarEvent;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, event: this.event});
  }

}
