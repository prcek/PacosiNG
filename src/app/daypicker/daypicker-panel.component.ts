import { Component, OnInit } from '@angular/core';
import * as R from 'ramda';
import * as M from 'moment';


interface DayInfo {
  date: Date;
  day: number;
  month: number;
  working_day: boolean;
  first: boolean;
  last: boolean;
}

@Component({
  selector: 'app-daypicker-panel',
  templateUrl: './daypicker-panel.component.html',
  styleUrls: ['./daypicker-panel.component.css']
})
export class DaypickerPanelComponent implements OnInit {
  dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá'];
  monthNames = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
  dayCount = 25;
  days: DayInfo[];
  constructor() { }

  ngOnInit() {
    const first_day = M();
    const days = R.take(this.dayCount, R.filter((d) => d.working_day, R.map(i => {
      const date = M(first_day).add(i, 'day');
      const day = date.date();
      const working_day = (date.day() !== 0) && (date.day() !== 6);
      const month = date.month();
      const first = false;
      const last = false;
      return {date: date.toDate(), day, working_day, month, first, last};
    }, R.range(0, this.dayCount * 2))));
    this.days = days.map((v, i, a) => {
      const r = R.clone(v);
      if (i === 0) {
        r.first = true;
      } else if (a[i - 1].month !== v.month) {
        r.first = true;
      }
      if (i === a.length - 1) {
        r.last = true;
      } else if (a[i + 1].month !== v.month) {
        r.last = true;
      }
      return r;
    });
  }
  get diag() {
    return JSON.stringify({days: this.days});
  }
}
