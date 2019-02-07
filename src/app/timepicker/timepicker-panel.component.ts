import { Component, OnInit, Input } from '@angular/core';
import * as R from 'ramda';
export interface TimePickValue {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-timepicker-panel',
  templateUrl: './timepicker-panel.component.html',
  styleUrls: ['./timepicker-panel.component.css']
})
export class TimepickerPanelComponent implements OnInit {
  @Input() selected: number;
  @Input() begin = 4 * 7;
  @Input() len = 4 * 10;
  @Input() timeSpan = 15;
  constructor() { }

  ngOnInit() {
  }
  get hours(): TimePickValue[] {
    return R.uniq(R.map((v) => this._calcTV_hour(v), this._range()));
  }
  get minutes(): TimePickValue[] {
    return R.uniq(R.map((v) => this._calcTV_minute(v), this._range()));
  }

  get selected_hour(): number {
    if (isNaN(this.selected)) {
      return null;
    }
    return this._calcTV_hour(this.selected).value;
  }
  get selected_minute(): number {
    if (isNaN(this.selected)) {
      return null;
    }
    return this._calcTV_minute(this.selected).value;
  }

  private _range(): number[] {
   return R.range(this.begin, this.begin + this.len);
  }
  private _calcTV_hour(val: number): TimePickValue {
    const minutes = (val * this.timeSpan);
    const min_rest = minutes % 60;
    const hour = (minutes - min_rest) / 60;
    return { value: hour, viewValue:  hour.toString().padStart(2, '0') };
  }
  private _calcTV_minute(val: number): TimePickValue {
    const minutes = (val * this.timeSpan);
    const minute = minutes % 60;
    return { value: minute, viewValue:  minute.toString().padStart(2, '0') };
  }

}
