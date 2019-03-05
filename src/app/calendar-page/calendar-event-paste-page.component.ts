import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, ICalendarEventType, ICalendarDaySlot, IClipBoardRecord } from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';

@Component({
  selector: 'app-calendar-event-paste-page',
  templateUrl: './calendar-event-paste-page.component.html',
  styleUrls: ['./calendar-event-paste-page.component.css']
})
export class CalendarEventPastePageComponent implements OnInit {
  clip: IClipBoardRecord;
  calendar: ICalendar;
  event_types: ICalendarEventType[];
  slots: ICalendarDaySlot[];
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
    this.clip = this.calendarService.clipboardValue();
   // this.sub = this.calendarService.eventClipboard$.subscribe( c => {
   //   console.log('CalendarEventClipComponent', c);
   //   this.clip = c;
   // });
  }
  get free_slots(): number[] {
    if (this.slots) {
      return R.map<ICalendarDaySlot, number>(s => s.slot, R.filter<ICalendarDaySlot>(R.propEq('empty', true), this.slots));
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
    return JSON.stringify({calendar: this.calendar});
  }

}
