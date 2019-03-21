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
  cal_ids: string[];
  days: string[];
  grid: ICalendarGridInfo;
  first_day: Date;
  selected_day: Date;
  loading = true;
  search_submitted = false;
  constructor(private calendarService: CalendarService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.first_day = M().utc().startOf('isoWeek').toDate();
    this.selected_day = M().utc().startOf('day').toDate();
    this.getCalendars();
  }

  getCalendars() {
    this.loading = true;
    if (this.route.snapshot.paramMap.has('cals')) {
      // cal ids forced
      const ids = R.filter(R.compose(R.not, R.isEmpty), R.split(',', this.route.snapshot.paramMap.get('cals')));
      if (ids.length > 0) {
        this.cal_ids = ids;
      }
    }
    // const cal_ids: string[] = R.filter(R.compose(R.not, R.isEmpty), this.route.snapshot.paramMap.get('cals'));
    // console.log('MainPageComponent, cal_ids', cal_ids);
    this.calendarService.getCalendarsStatus(this.cal_ids, this.selected_day, M(this.selected_day).add(10, 'days').toDate())
      .subscribe((r) => {
          this.cals = r;
          // console.log('CALS', r );
          this.grid = this.calendarService.convertStatuses2Grid(r);
          // console.log('GRID', this.grid.days[0].day.toISOString() );
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
     if (!status.any_ohs) { return; }
     const d = M.utc(status.day).format('YYYY-MM-DD');
     // alert(status.calendar_id + '/' + d);
     this.router.navigate(['/calendars/events/' + status.calendar_id + '/day/' + d]);
   }
   onSearch(str: string) {
     this.search_submitted = true;
     this.router.navigate(['calendars', 'search', {cals: this.cal_ids, str}]);
   }
  get diag() { return JSON.stringify({grid: this.grid, selected_day: M(this.selected_day).toISOString()}); }
}
