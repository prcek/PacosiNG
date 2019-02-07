import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() timeBegin = 4 * 7;
  @Input() timeLen = 4 * 10;
  @Input() timeSpan = 5;
  @Output() close = new EventEmitter<void>();
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
  click_hour(value: number) {
    console.log('click_hour', value);
  }
  click_minute(value: number) {
    console.log('click_minute', value);
  }

  onOk() {
    console.log('Ok');
    this.close.emit();
  }

  onCancel() {
    console.log('Cancel');
    this.close.emit();
  }
  trackByFn(index, value) {
    return value.value;
  }

  private _range(): number[] {
   return R.range(this.timeBegin, this.timeBegin + this.timeLen);
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
