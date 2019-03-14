import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, ICalendarEventType, ICalendarDaySlot } from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';
@Component({
  selector: 'app-calendar-event-new-page',
  templateUrl: './calendar-event-new-page.component.html',
  styleUrls: ['./calendar-event-new-page.component.css']
})
export class CalendarEventNewPageComponent implements OnInit {

  calendar: ICalendar;
  event_types: ICalendarEventType[];
  slots: ICalendarDaySlot[];
  day: Date;
  time: number;
  loading = true;
  extra = false;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
    this.time = parseInt(this.route.snapshot.paramMap.get('slot'), 10);
    this.extra = this.route.snapshot.paramMap.get('extra') === 'yes';
    this.getCalendarWithEvents();
  }
  get free_slots(): number[] {
    // tslint:disable-next-line:max-line-length
    const ft = this.extra ? R.anyPass([R.propEq('empty', true), R.propEq('event_s_leg', true)]) : R.propEq('empty', true);
    if (this.slots) {
        return R.map<ICalendarDaySlot, number>(s => s.slot, R.filter<ICalendarDaySlot>(ft, this.slots));
    }
    return [];
  }

  get start_slots(): number[] {
    // tslint:disable-next-line:max-line-length
    const ft = this.extra ? R.anyPass([R.propEq('empty', true), R.propEq('event_s_leg', true)]) : R.allPass([R.propEq('empty', true), R.propEq('cluster_idx', 0)]);
    if (this.slots) {
        return R.map<ICalendarDaySlot, number>(s => s.slot, R.filter<ICalendarDaySlot>(ft, this.slots));
    }
    return [];
  }

  getCalendarWithEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.calendarService.getCalendarWithEvents(id, this.day)
      .subscribe(d => {
        this.calendar = d.calendar;
        this.event_types = d.event_types;
        this.slots = d.slots;
        // this.events = d.event; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }

  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({
      calendar: this.calendar,
      extra: this.extra,
      free_slots: this.free_slots,
      start_slots: this.start_slots,
      time: this.time
    });
  }
}
