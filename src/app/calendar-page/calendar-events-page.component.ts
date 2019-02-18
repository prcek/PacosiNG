import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, IOpeningHours, ICalendarDaySlot } from '../calendar.service';
import * as M from 'moment';
@Component({
  selector: 'app-calendar-events-page',
  templateUrl: './calendar-events-page.component.html',
  styleUrls: ['./calendar-events-page.component.css']
})
export class CalendarEventsPageComponent implements OnInit {
  calendar: ICalendar;
  day: Date;
  events: ICalendarEvent[];
  ohs: IOpeningHours[];
  slots: ICalendarDaySlot[];
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private calendarService: CalendarService) {}

  ngOnInit() {
    this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
    this.getCalendarWithEvents();
  }
  getCalendarWithEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.calendarService.getCalendarWithEvents(id, this.day)
      .subscribe(d => {
        this.calendar = d.calendar; this.events = d.events; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }
  goBack(): void {
    this.location.back();
  }

  onSlot(slot: ICalendarDaySlot) {
    alert('onSlot ' + slot.slot);
  }

  get diag() {
    return JSON.stringify({
      day: this.day,
      slots: this.slots,
      ohs: this.ohs,
      events: this.events,
      calendar: this.calendar
    });
  }
}
