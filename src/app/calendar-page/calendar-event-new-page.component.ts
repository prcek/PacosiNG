import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent } from '../calendar.service';

@Component({
  selector: 'app-calendar-event-new-page',
  templateUrl: './calendar-event-new-page.component.html',
  styleUrls: ['./calendar-event-new-page.component.css']
})
export class CalendarEventNewPageComponent implements OnInit {

  calendar: ICalendar;
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
    return JSON.stringify({calendar: this.calendar});
  }
}
