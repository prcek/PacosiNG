import { Component, OnInit, Input } from '@angular/core';
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
  const xb = R.map<number, IDaySlot>( i => ({ blank: false, day: i}), R.range(1, month_days + 1));
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
export class Daypicker2Component implements OnInit {
  dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
  monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

  @Input() _start_month: string; // = '2019-06-01';


  monthPage: IMonthPage;

  constructor() { }



  ngOnInit() {
    console.log('Daypicker2Component.ngOnInit', this._start_month);


    const sd = M.utc(this._start_month).startOf('month');

    this.monthPage = _calcMonthPage(sd.year(), sd.month() + 1);
    }

}
