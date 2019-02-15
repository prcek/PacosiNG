import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendarStatus } from '../calendar.service';
import * as M from 'moment';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  cals: ICalendarStatus[];
  loading = true;
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.getCalendars();
  }
  getCalendars() {
    const now = M().startOf('day');
    this.loading = true;
    this.calendarService.getCalendarsStatus(now.toDate(), M(now).add(10, 'days').toDate())
      .subscribe((r) => {
          this.cals = r;
          this.loading = false;
      } );
  }

  get diag() { return JSON.stringify({cals: this.cals}); }
}
