import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as R from 'ramda';
import * as M from 'moment';


interface DayInfo {
  date: Date;
  day: number;
  month: number;
  working_day: boolean;
  selected: boolean;
  first: boolean;
  last: boolean;
}

@Component({
  selector: 'app-daypicker-panel',
  templateUrl: './daypicker-panel.component.html',
  styleUrls: ['./daypicker-panel.component.css']
})
export class DaypickerPanelComponent implements OnInit, OnChanges {
  @Input() first_day: Date;
  @Output() select = new EventEmitter<Date>();
  @Input() selected_day: Date;
  @Input() selected_week: Date;
  dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá'];
  monthNames = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
  dayCount = 25;
  days: DayInfo[];
  constructor() { }

  setDaysInfo() {
    const first_day = M(this.first_day).startOf('isoWeek');
    const days = R.take(this.dayCount, R.filter((d) => d.working_day, R.map(i => {
      const date = M(first_day).add(i, 'day');
      const day = date.date();
      const working_day = (date.day() !== 0) && (date.day() !== 6);
      const month = date.month();
      const selected = (this.selected_day && M(this.selected_day).isSame(date, 'day')) ||
        (this.selected_week && M(this.selected_week).isSame(date, 'isoWeek'));

      const first = false;
      const last = false;
      return {date: date.toDate(), day, working_day, month, first, last, selected};
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

  ngOnInit() {
    this.setDaysInfo();
  }
  ngOnChanges(changes: SimpleChanges) {
    if ((changes.first_day && !changes.first_day.firstChange) ||
        (changes.selected_day && !changes.selected_day.firstChange) ||
        (changes.selected_week && !changes.selected_week.firstChange)
        ) {
      this.setDaysInfo();
    }
  }
  onDayClick(d: Date) {
    console.log('onDayClick', d);
    this.select.emit(d);
  }
  get diag() {
    return JSON.stringify({days: this.days});
  }
}
