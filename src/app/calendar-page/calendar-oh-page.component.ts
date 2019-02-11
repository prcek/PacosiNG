import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendar, IOpeningHours } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as M from 'moment';
import * as R from 'ramda';
interface IOHGroup {
  day: Date;
  ohs: IOpeningHours[];
}

function l2g(ts: IOpeningHours[]): IOHGroup[] {
  const tog = (val: IOpeningHours[], key: string) => ({day: key, ohs: val});
  const x = R.values(R.mapObjIndexed(tog, R.groupBy<IOpeningHours>(R.prop('day'),
      R.sortWith([R.ascend(R.prop('day')), R.ascend(R.prop('begin'))], ts)
  )));
  // console.log('L2G', ts, x);
  return x;
}


@Component({
  selector: 'app-calendar-oh-page',
  templateUrl: './calendar-oh-page.component.html',
  styleUrls: ['./calendar-oh-page.component.css']
})
export class CalendarOhPageComponent implements OnInit {
  date = '';
  days = 7;
  calendar: ICalendar;
  ohs: IOpeningHours[];
  oh_groups: IOHGroup[];
  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
    this.date = M().format('YYYY-MM-DD');
    this.getCalendarWithOHs();
  }

  getCalendarWithOHs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarService.getCalendarWithOpeningHours(id)
      .subscribe(d => { this.calendar = d.calendar; this.ohs = d.ohs; this.oh_groups = l2g(d.ohs); });
  }

  goBack(): void {
    this.location.back();
  }

  onDeleteOH(oh: IOpeningHours): void {

  }
  get diag() {
    return JSON.stringify({date: this.date, days: this.days, ohs: this.ohs, oh_groups: this.oh_groups, calendar: this.calendar});
  }
}
