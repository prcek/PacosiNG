import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendarStatus, ICalendarDayStatus, ICalendar, ICalendarGridInfo } from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  cals: ICalendarStatus[];
  days: string[];
  grid: ICalendarGridInfo;
  first_day: Date;
  selected_day: Date;
  loading = true;
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.first_day = M().utc().startOf('isoWeek').toDate();
    this.selected_day = M().utc().startOf('day').toDate();
    this.getCalendars();
  }

  getCalendars() {
    this.loading = true;
    this.calendarService.getCalendarsStatus(this.selected_day, M(this.selected_day).add(10, 'days').toDate())
      .subscribe((r) => {
          this.cals = r;
          this.grid = this.calendarService.convertStatuses2Grid(r);
          this.loading = false;
      } );
  }

  onChangeDay(d: Date) {
    this.selected_day = d;

    this.getCalendars();
   }

   onMoveCal(d: Date) {
     this.first_day = d;
    // this.getCalendarWithOHs();
   }
  get diag() { return JSON.stringify({grid: this.grid, selected_day: M(this.selected_day).toISOString()}); }
}
