import { Component, OnInit } from '@angular/core';
import {
  CalendarService,
  ICalendarStatus,
  ICalendarGridInfo,
  ICalendarDayStatusE
} from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';
import { Router, ActivatedRoute } from '@angular/router';


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
  constructor(private calendarService: CalendarService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.first_day = M().utc().startOf('isoWeek').toDate();
    this.selected_day = M().utc().startOf('day').toDate();
    this.getCalendars();
  }

  getCalendars() {
    this.loading = true;
    // const cal_ids: string[] = R.filter(R.compose(R.not, R.isEmpty), this.route.snapshot.paramMap.get('cals'));
    // console.log('MainPageComponent, cal_ids', cal_ids);
    this.calendarService.getCalendarsStatus(this.selected_day, M(this.selected_day).add(10, 'days').toDate())
      .subscribe((r) => {
          this.cals = r;
          console.log('CALS', r );
          this.grid = this.calendarService.convertStatuses2Grid(r);
          console.log('GRID', this.grid.days[0].day.toISOString() );
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

   onSelect(status: ICalendarDayStatusE) {
     console.log('onSelect', status);
     const d = M.utc(status.day).format('YYYY-MM-DD');
     // alert(status.calendar_id + '/' + d);
     this.router.navigate(['/calendars/events/' + status.calendar_id + '/day/' + d]);
   }

  get diag() { return JSON.stringify({grid: this.grid, selected_day: M(this.selected_day).toISOString()}); }
}
