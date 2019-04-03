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
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  cals: ICalendarStatus[];
  cal_ids: string[] = null;
  loc_ids: string[];
  pref_loc_id: string = null;
  // days: string[];
  grid: ICalendarGridInfo;
  first_day: Date;
  selected_day: Date;
  loading = true;
  search_submitted = false;
  constructor(
    private auth: AuthService,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.first_day = M().utc().startOf('isoWeek').toDate();
    this.selected_day = M().utc().startOf('day').toDate();
    if (this.route.snapshot.paramMap.has('pref_loc_id')) {
      this.pref_loc_id = this.route.snapshot.paramMap.get('pref_loc_id');
    }
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
          this.loc_ids =  R.uniq(R.map<ICalendarStatus>(cs => cs.calendar.location_id, r));
          // console.log('CALS', r );
          if (this.pref_loc_id && this.loc_ids.length > 1) {
            const rf = R.filter( cs => cs.calendar.location_id === this.pref_loc_id, r);
            this.grid = this.calendarService.convertStatuses2Grid(rf);
          } else {
            this.grid = this.calendarService.convertStatuses2Grid(r);
          }
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

   onLocation(location_id: string) {
   // alert('loc pref=' + location_id);
    this.auth.setUserData('pref_loc_id', location_id);
    this.pref_loc_id = location_id;
    this.router.navigate(['/main', {cals: this.auth.userInfo.calendar_ids, pref_loc_id: location_id}]);
    this.getCalendars();
   }

  get diag() { return JSON.stringify({grid: this.grid, selected_day: M(this.selected_day).toISOString()}); }
}
