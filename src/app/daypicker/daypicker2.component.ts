import { Component, OnInit, Input } from '@angular/core';
import * as R from 'ramda';
import * as M from 'moment';


const FIRST_DAY_CORR = [6, 0, 1, 2, 3, 4, 5];

interface IDaySlot {
  date: Date | null;
}


@Component({
  selector: 'app-daypicker2',
  templateUrl: './daypicker2.component.html',
  styleUrls: ['./daypicker2.component.css']
})
export class Daypicker2Component implements OnInit {
  dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  @Input() _start_month: string; // = '2019-06-01';

  slots: number[] = [];
  _first_day_off = 0;
  _month_days = 0;
  _last_day_addon = 0;
  _total_slots = 0;
  constructor() { }

  ngOnInit() {
    console.log('Daypicker2Component.ngOnInit', this._start_month);
    const sd = M.utc(this._start_month).startOf('month');
    this._first_day_off = FIRST_DAY_CORR[sd.isoWeekday()];

    this._month_days = M(sd).add(1, 'month').diff(sd, 'days');
    const dr = (this._first_day_off + this._month_days) % 7;
    if (dr) {
      this._last_day_addon = 7 - dr;
    } else {
      this._last_day_addon = 0;
    }
    this._total_slots = this._first_day_off + this._month_days + this._last_day_addon;


    const xa =  R.map( i => null, R.range(0, this._first_day_off));
    const xb =  R.map( i => i, R.range(1, this._month_days + 1));
    const xc = R.map( i => null, R.range(0, this._last_day_addon));
    this.slots =  [...xa, ...xb, ...xc];
    // console.log("XXBLA",xa,xb,xc);
    }

}
