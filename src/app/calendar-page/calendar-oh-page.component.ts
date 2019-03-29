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




  const tog = (val: IOpeningHours[], key: string) => ({day: M.utc(key).toDate(), ohs: val});

  const sorted: IOpeningHours[] = R.sortWith<IOpeningHours>([R.ascend(R.prop('day')), R.ascend(R.prop('begin'))], ts);
  const grouped = R.groupBy<IOpeningHours>( (i) => M.utc(i.day).format('YYYY-MM-DD'), sorted);
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
  first_day: Date;
  days = 7;
  day_list: string[] = [];
  calendar: ICalendar;
  ohs: IOpeningHours[];
  oh_groups: IOHGroup[];
  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }
  setFirstDay(base?: Date) {
    this.first_day = M(base).utc().startOf('isoWeek').toDate();
    this.day_list = R.map((d: number) => M(this.first_day).add(d, 'day').format('YYYY-MM-DD'), R.range(0, this.days));
  }

  ngOnInit() {
    const start_day = this.route.snapshot.paramMap.get('start_day');
    if (start_day) {
      // console.log("START_DAY",start_day);
      this.setFirstDay(M.utc(start_day).startOf('isoWeek').toDate());
    } else {
      this.setFirstDay();
    }

    this.getCalendarWithOHs();
  }

  onChangeDay(d: Date) {
  // alert('xx' + M(d).utc().toISOString());
   this.setFirstDay(d);
   this.getCalendarWithOHs();
  }

  onMoveCal(d: Date) {
    this.setFirstDay(d);
    this.getCalendarWithOHs();
  }

  getCalendarWithOHs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarService.getCalendarWithOpeningHours(id, this.first_day, M(this.first_day).utc().add(this.days, 'day').toDate())
      .subscribe(d => { this.calendar = d.calendar; this.ohs = d.ohs; this.oh_groups = l2g(d.ohs); });
  }

  goBack(): void {
    this.location.back();
  }

  onDeleteOH(oh: IOpeningHours): void {
    console.log('onDeleteOH', oh);
    this.calendarService.deleteOpeningHours(oh._id)
      .subscribe( r => {
        console.log('deleteOpeningHours.result=', r);
        if (r.ok) {
          this.getCalendarWithOHs();
        } else {
          alert('chyba');
        }
      });
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
