import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, ICalendarEventType } from '../calendar.service';
import * as M from 'moment';

@Component({
  selector: 'app-calendar-event-new-page',
  templateUrl: './calendar-event-new-page.component.html',
  styleUrls: ['./calendar-event-new-page.component.css']
})
export class CalendarEventNewPageComponent implements OnInit {

  calendar: ICalendar;
  event_types: ICalendarEventType[];
  day: Date;
  time: number;
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
    this.time = parseInt(this.route.snapshot.paramMap.get('slot'), 10);
    this.getCalendarWithEvents();
  }

  getCalendarWithEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.calendarService.getCalendarWithEvents(id, this.day)
      .subscribe(d => {
        this.calendar = d.calendar;
        this.event_types = d.event_types;
        // this.events = d.event; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }

  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar});
  }
}
