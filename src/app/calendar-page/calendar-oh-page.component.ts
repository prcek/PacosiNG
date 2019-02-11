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




  const tog = (val: IOpeningHours[], key: string) => ({day: M(key).toDate(), ohs: val});

  const sorted: IOpeningHours[] = R.sortWith<IOpeningHours>([R.ascend(R.prop('day')), R.ascend(R.prop('begin'))], ts);
  const grouped = R.groupBy<IOpeningHours>( (i) => M(i.day).format('YYYY-MM-DD'), sorted);
  const x = R.values(R.mapObjIndexed(tog, grouped));
/*
  const x = R.values(R.mapObjIndexed(tog, R.groupBy<IOpeningHours>(R.prop<Date>('day'),
      R.sortWith([R.ascend(R.prop('day')), R.ascend(R.prop('begin'))], ts)
  )));
  // console.log('L2G', ts, x);
  */
  return x;
}


@Component({
  selector: 'app-calendar-oh-page',
  templateUrl: './calendar-oh-page.component.html',
  styleUrls: ['./calendar-oh-page.component.css']
})
export class CalendarOhPageComponent implements OnInit {
  first_day = '';
  days = 7;
  day_list: string[] = [];
  calendar: ICalendar;
  ohs: IOpeningHours[];
  oh_groups: IOHGroup[];
  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
    this.first_day = M().format('YYYY-MM-DD');
    this.day_list = R.map((d: number) => M(this.first_day).add(d, 'day').format('YYYY-MM-DD'), R.range(0, this.days));
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
    return JSON.stringify({
      first_day: this.first_day,
      day_list: this.day_list,
      ohs: this.ohs,
      oh_groups: this.oh_groups,
      calendar: this.calendar
    });
  }
}
