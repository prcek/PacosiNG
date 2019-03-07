import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  CalendarService,
  ICalendar,
  ICalendarEvent,
  ICalendarEventType,
  ICalendarDaySlot,
  IClipBoardRecord,
  ICalendarWithEvents,
  ICalendarWithEventTypes
} from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-calendar-event-paste-page',
  templateUrl: './calendar-event-paste-page.component.html',
  styleUrls: ['./calendar-event-paste-page.component.css']
})
export class CalendarEventPastePageComponent implements OnInit {
  clip: IClipBoardRecord;
  clip_event: ICalendarEvent;
  cut_mode = false;
  calendar_id: string;
  calendar: ICalendar;
  event_types: ICalendarEventType[];
  ready = false;
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
    this.calendar_id = this.route.snapshot.paramMap.get('id');
    this.clip = this.calendarService.clipboardValue();

    if (!this.clip)  { return; }
    combineLatest([
      this.calendarService.getCalendarWithEvents(this.calendar_id, this.day),
      this.calendarService.getCalendarWithEventTypes(this.clip.event.calendar_id)
    ]).subscribe( (res) => {
      const d = <ICalendarWithEvents>res[0];
      const c = <ICalendarWithEventTypes>res[1];
      this.calendar = d.calendar;
      this.event_types = d.event_types;
      this.slots = d.slots;
      this.cut_mode = this.clip.cutMode;
      this.clip_event = R.clone(this.clip.event);
      this.clip_event._id = null;
      this.clip_event.day = this.day;
      this.clip_event.begin = this.time;
      if (this.clip_event.calendar_id === this.calendar_id) {
        this.ready = true;
        this.loading = false;
      } else {
        const ce = R.find<ICalendarEventType>(R.propEq('_id', this.clip_event.event_type_id), c.event_types);
        if (ce) {
          console.log('MATCH KEY', ce.match_key);
          const cce = R.find<ICalendarEventType>(R.propEq('match_key', ce.match_key), this.event_types);
          if (cce) {
            console.log('MATCH KEY FOUND', cce);
            this.clip_event.event_type_id = cce._id;
            this.clip_event.len = cce.len;
          } else {
            this.clip_event.event_type_id = null;
            this.clip_event.len = null;
          }
        } else {
          this.clip_event.event_type_id = null;
          this.clip_event.len = null;
        }
        this.ready = true;
        this.loading = false;
      }
    });

  }
  get free_slots(): number[] {
    if (this.slots) {
      return R.map<ICalendarDaySlot, number>(s => s.slot, R.filter<ICalendarDaySlot>(R.propEq('empty', true), this.slots));
    }
    return [];
  }
  /*
  getCalendarWithEvents() {
    this.loading = true;
    this.calendarService.getCalendarWithEvents(this.calendar_id, this.day)
      .subscribe(d => {
        this.calendar = d.calendar;
        this.event_types = d.event_types;
        this.slots = d.slots;
        // this.events = d.event; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }
  */

  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar});
  }

}
