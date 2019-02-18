import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, ICalendarEventType } from '../calendar.service';
import * as M from 'moment';

@Component({
  selector: 'app-calendar-event-page',
  templateUrl: './calendar-event-page.component.html',
  styleUrls: ['./calendar-event-page.component.css']
})
export class CalendarEventPageComponent implements OnInit {
  calendar: ICalendar;
  event: ICalendarEvent;
  event_types: ICalendarEventType[];
  day: Date;
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
    this.getCalendarWithEvent();
  }

  getCalendarWithEvent() {
    const id = this.route.snapshot.paramMap.get('id');
    const event_id = this.route.snapshot.paramMap.get('e_id');
    this.loading = true;
    this.calendarService.getCalendarWithEvent(id, this.day, event_id)
      .subscribe(d => {
        this.calendar = d.calendar;
        this.event = d.event;
        this.event_types = d.event_types;
        // this.events = d.event; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }

  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, event: this.event});
  }

}
