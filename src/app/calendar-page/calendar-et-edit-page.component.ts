import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendar, ICalendarEventType } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calendar-et-edit-page',
  templateUrl: './calendar-et-edit-page.component.html',
  styleUrls: ['./calendar-et-edit-page.component.css']
})
export class CalendarEtEditPageComponent implements OnInit {
  calendar: ICalendar;
  event_type: ICalendarEventType;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.getCalendarWithET();
  }
  getCalendarWithET() {
    const id = this.route.snapshot.paramMap.get('id');
    const et_id = this.route.snapshot.paramMap.get('et_id');
    this.calendarService.getCalendarWithEventType(id, et_id)
      .subscribe(d => { this.calendar = d.calendar; this.event_type = d.event_type; });
  }
  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, event_type: this.event_type});
  }
}
