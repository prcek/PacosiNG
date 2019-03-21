import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService } from '../calendar.service';
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
  constructor(
    private route: ActivatedRoute,
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
  }
  goBack(): void {
    this.location.back();
  }
  doSearch() {
    this.wait = true;
    const sday = M().utc().startOf('isoWeek').subtract(30, 'days').toDate();
    const eday = M().utc().startOf('isoWeek').add(30, 'days').toDate();
    this.calendarService.searchCalendarEvents(this.search_string, this.cal_ids, sday, eday).subscribe(evs => {
      console.log('evs', evs);
      this.wait = false;
    });
  }

  onSearch(event) {
    alert('onSearch' +  JSON.stringify(event));
    this.search_string = event;
    this.doSearch();
  }
}
