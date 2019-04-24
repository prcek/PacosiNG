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
  selector: 'app-plan-page',
  templateUrl: './plan-page.component.html',
  styleUrls: ['./plan-page.component.css']
})
export class PlanPageComponent implements OnInit {
  show_days = 20;
  cals: ICalendarStatus[];
  cal_ids: string[];
  loc_ids: string[];
  pref_loc_id: string = null;

  grid: ICalendarGridInfo;
  first_day: Date;
  selected_day: Date;
  loading = true;

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
      const ids = R.filter(R.compose(R.not, R.isEmpty), R.split(',', this.route.snapshot.paramMap.get('cals')));
      if (ids.length > 0) {
        this.cal_ids = ids;
      }
    }

    this.calendarService.getCalendarsStatus(this.cal_ids, this.selected_day, M(this.selected_day).add(this.show_days, 'days').toDate())
      .subscribe((r) => {
          this.cals = r;
          this.loc_ids =  R.uniq(R.map<ICalendarStatus, string>((cs: ICalendarStatus) => cs.calendar.location_id, r));
          if (this.pref_loc_id && this.loc_ids.length > 1) {
            const rf = R.filter<ICalendarStatus>( (cs: ICalendarStatus)  => cs.calendar.location_id === this.pref_loc_id, r);
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
  }

  onLocation(location_id: string) {
     this.auth.setUserData('pref_loc_id', location_id);
     this.pref_loc_id = location_id;
     this.router.navigate(['plan', {cals: this.auth.userInfo.calendar_ids, pref_loc_id: location_id}]);
     this.getCalendars();
  }

  onSelect(status: ICalendarDayStatusE) {
    this.router.navigate(['calendars', 'oh', status.calendar_id, {start_day: status.day}]);
  }
}
