import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendarEvent } from '../calendar.service';
import * as R from 'ramda';
import * as M from 'moment';
@Component({
  selector: 'app-calendar-event-search-page',
  templateUrl: './calendar-event-search-page.component.html',
  styleUrls: ['./calendar-event-search-page.component.css']
})
export class CalendarEventSearchPageComponent implements OnInit {
  search_string = '';
  iss = '';
  submitted = false;
  wait = false;
  cal_ids = null;
  events: ICalendarEvent[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('str')) {
      this.iss = this.route.snapshot.paramMap.get('str');
      this.search_string = this.iss;
    }

    if (this.route.snapshot.paramMap.has('cals')) {
      // cal ids forced
      const ids = R.filter(R.compose(R.not, R.isEmpty), R.split(',', this.route.snapshot.paramMap.get('cals')));
      if (ids.length > 0) {
        this.cal_ids = ids;
      }
    }
    if (this.search_string && this.search_string.trim().length) {
      this.doSearch();
    }
  }
  goBack(): void {
    this.location.back();
  }

  get displayedColumns(): string[] {
      return [ /*'id',*/ 'calendar_id', 'day', 'time', 'event_name', 'first_name', 'last_name', 'year', 'phone', 'actions'];
  }


  doSearch() {
    this.wait = true;
    const sday = M().utc().startOf('isoWeek').subtract(30, 'days').toDate();
    const eday = M().utc().startOf('isoWeek').add(1, 'year').toDate();
    this.calendarService.searchCalendarEvents(this.search_string, this.cal_ids, sday, eday).subscribe(evs => {
      // console.log('evs', evs);
      this.events = evs;
      this.wait = false;
    });
  }

  onSearch(str) {
    this.search_string = str;
    this.doSearch();
  }
  onView(event) {
    this.router.navigate(['calendars', 'events', event.calendar_id, 'day', M.utc(event.day).format('YYYY-MM-DD')]);
  }
}
