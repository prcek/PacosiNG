import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import * as R from 'ramda';
import * as M from 'moment';


const FIRST_DAY_CORR = [6, 0, 1, 2, 3, 4, 5];

interface IDaySlot {
  blank: boolean;
  day: number;
}

interface IMonthPage {
  year: number;
  month: number;
  days: IDaySlot[];
  weeks: IWeekRow[];
}

interface IWeekRow {
  days: IDaySlot[];
  span_blank_l: number;
  span_days: number;
  span_blank_r: number;
}

function _week_spans(days: IDaySlot[]) {
  return R.reduce((a, v ) => {
    if (v.blank) {
      if (a.span_days) {
        return {span_blank_l: a.span_blank_l, span_days: a.span_days, span_blank_r: a.span_blank_r + 1};
      } else {
        return {span_blank_l: a.span_blank_l + 1, span_days: 0, span_blank_r: 0};
      }
    } else {
      return {span_blank_l: a.span_blank_l, span_days: a.span_days + 1, span_blank_r: 0};
    }
  }, {span_blank_l: 0, span_days: 0, span_blank_r: 0 }, days);
}

function _calcMonthPage(year: number, month: number): IMonthPage {
  const first_day = M.utc('' + year + '-' + month + '-01', 'YYYY-MM-DD');
  // console.log('FIRST_DAY', first_day.toISOString());

  const first_day_off = FIRST_DAY_CORR[first_day.isoWeekday()];
  const month_days = M(first_day).add(1, 'month').diff(first_day, 'days');

  const dr = (first_day_off + month_days) % 7;
  const last_day_addon = dr ? 7 - dr : 0;

 // const total_slots = first_day_off + month_days + last_day_addon;

  const xa = R.map<number, IDaySlot>( i => ({ blank: true, day: -1}), R.range(0, first_day_off));
  const xb = R.map<number, IDaySlot>( i => ({ blank: false, day: i, date: '' + year + '-' + month + '-' + i}), R.range(1, month_days + 1));
  const xc = R.map<number, IDaySlot>( i => ({ blank: true, day: -1}), R.range(0, last_day_addon));
  const all_days = [...xa, ...xb, ...xc];
  const weeks = R.map<IDaySlot[], IWeekRow>( w => ({
      days: w,
      ..._week_spans(w),
    }), R.splitEvery(7, all_days));

  return {
    year,
    month,
    days: all_days,
    weeks
  };
}



@Component({
  selector: 'app-daypicker2',
  templateUrl: './daypicker2.component.html',
  styleUrls: ['./daypicker2.component.css']
})

export class Daypicker2Component implements OnInit , OnChanges {
  dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
  monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

  @Input() first_day: Date;
  @Output() select = new EventEmitter<Date>();
  @Output() move = new EventEmitter<Date>();
  @Input() selected_day: Date;
  @Input() selected_week: Date;

  monthPage: IMonthPage;

  constructor() { }


  ngOnInit() {
    this.setDaysInfo();
  }

  setDaysInfo() {
    const sd = M.utc(this.first_day).startOf('month');
    this.monthPage = _calcMonthPage(sd.year(), sd.month() + 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.first_day && !changes.first_day.firstChange) ||
        (changes.selected_day && !changes.selected_day.firstChange) ||
        (changes.selected_week && !changes.selected_week.firstChange)
        ) {
      this.setDaysInfo();
    }
  }

  onDayClick(d: string) {
   this.select.emit(M.utc(d, 'YYYY-MM-DD').toDate());
  }

  onMoveLeft() {
    this.move.emit(M(this.first_day).utc().startOf('month').subtract(1, 'month').toDate());
  }
  onMoveRight() {
    this.move.emit(M(this.first_day).utc().startOf('month').add(1, 'month').toDate());
  }
  onMoveToday() {
    this.move.emit(M().utc().startOf('month').toDate());
  }

}
