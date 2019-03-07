import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, WrappedValue } from '@angular/core';
import { CalendarService, ICalendar } from '../calendar.service';
import { SubscriptionLike } from 'rxjs';

@Pipe({
  name: 'calendar',
  pure: false
})
export class CalendarPipe implements PipeTransform, OnDestroy {

  private _latestValue: ICalendar = null;
  private _latestReturnedValue: ICalendar = null;
  private _subscription: SubscriptionLike = null;
  private _id: string;

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
  }

  constructor(private calendarService: CalendarService, private _ref: ChangeDetectorRef) {

  }
  transform(id: string, args?: any): any {
    if (!this._id) {
      if (id) {
        this._subscribe(id);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (id !== this._id) {
      this._dispose();
      return this.transform(id);
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return WrappedValue.wrap(this._latestValue);

  }

  private _subscribe(id: string): void {
    this._id = id;
    this._subscription = this.calendarService.watchCalendar(id).subscribe(loc => this._updateLatestValue(id, loc));
  }

  private _dispose(): void {
    this._subscription.unsubscribe();
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._id = null;
  }

  private _updateLatestValue(id: string, value: ICalendar): void {
    if (id === this._id) {
      this._latestValue = value;
      this._ref.markForCheck();
    }
  }

}
