import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEventType } from '../calendar.service';

@Component({
  selector: 'app-calendar-et-page',
  templateUrl: './calendar-et-page.component.html',
  styleUrls: ['./calendar-et-page.component.css']
})
export class CalendarEtPageComponent implements OnInit {
  calendar: ICalendar;
  event_types: ICalendarEventType[];
  displayedColumns: string[] = ['name', 'color', 'len', 'order', 'actions'];
  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
    this.getCalendarWithETs();
  }
  getCalendarWithETs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarService.getCalendarWithEventTypes(id)
      .subscribe(d => { this.calendar = d.calendar; this.event_types = d.event_types; });
  }
  goBack(): void {
    this.location.back();
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, event_types: this.event_types});
  }

}
