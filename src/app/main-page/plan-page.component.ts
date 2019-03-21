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
  selector: 'app-plan-page',
  templateUrl: './plan-page.component.html',
  styleUrls: ['./plan-page.component.css']
})
export class PlanPageComponent implements OnInit {
  cals: ICalendarStatus[];
  cal_ids: string[];
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
    if (this.route.snapshot.paramMap.has('cals')) {
      const ids = R.filter(R.compose(R.not, R.isEmpty), R.split(',', this.route.snapshot.paramMap.get('cals')));
      if (ids.length > 0) {
        this.cal_ids = ids;
      }
    }

    this.calendarService.getCalendarsStatus(this.cal_ids, this.selected_day, M(this.selected_day).add(10, 'days').toDate())
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
  }

  onSelect(status: ICalendarDayStatusE) {
    alert('todo');
  }
}
