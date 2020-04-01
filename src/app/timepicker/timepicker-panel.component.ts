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
  @Input() timeOffset = 0;
  @Output() close = new EventEmitter<void>();
  @Output() new_value = new EventEmitter<number>();

  hours: TimePickValue[];
  minutes: TimePickValue[];
  orig_selected_hour: number;
  orig_selected_minute: number;
  new_selected_hour: number = null;
  new_selected_minute: number = null;
  constructor() { }

  ngOnInit() {
    console.log('TimepickerPanelComponent.ngOnInit', this.selected, this.timeSpan, this.timeOffset);
    const sf = R.compose(R.sortBy<TimePickValue>(R.prop('value')), R.uniq);
    this.hours = sf(R.map((v) => this._calcTV_hour(v), this._range()));
    this.minutes = sf(R.map((v) => this._calcTV_minute(v), this._range()));
    if (isNaN(this.selected) || this.selected == null) {
      // console.log('setting null orig');
      this.orig_selected_hour = null;
      this.orig_selected_minute = null;
    } else {
      this.orig_selected_hour = this._calcTV_hour(this.selected).value;
      this.orig_selected_minute = this._calcTV_minute(this.selected).value;
    }
  }

  get selected_hour(): number {
    if (this.new_selected_hour !== null) {
      return this.new_selected_hour;
    }
    return this.orig_selected_hour;
  }
  get selected_minute(): number {
    if (this.new_selected_minute !== null) {
      return this.new_selected_minute;
    }
    return this.orig_selected_minute;
  }

  get canOk(): boolean {
    const m = this.selected_minute;
    const h = this.selected_hour;
    return (h !== null && m !== null);
  }
  click_hour(value: number) {
    this.new_selected_hour = value;
  }
  click_minute(value: number) {
    this.new_selected_minute = value;
  }

  onOk() {
    const m = this.selected_minute;
    const h = this.selected_hour;
    if (h !== null && m !== null) {
      const t = h * 60 + m - this.timeOffset;
      if ((t % this.timeSpan) === 0) {
        this.new_value.emit(t / this.timeSpan);
      }
    }
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }


  private _range(): number[] {
   return R.range(this.timeBegin, this.timeBegin + this.timeLen);
  }
  private _calcTV_hour(val: number): TimePickValue {
    const minutes = (val * this.timeSpan) + this.timeOffset;
    const min_rest = minutes % 60;
    const hour = (minutes - min_rest) / 60;
    return { value: hour, viewValue:  hour.toString().padStart(2, '0') };
  }
  private _calcTV_minute(val: number): TimePickValue {
    const minutes = (val * this.timeSpan) + this.timeOffset;
    const minute = minutes % 60;
    return { value: minute, viewValue:  minute.toString().padStart(2, '0') };
  }

}
