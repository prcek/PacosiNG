import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, WrappedValue } from '@angular/core';
import { LocationService, ILocation } from '../location.service';
import { SubscriptionLike } from 'rxjs';

@Pipe({
  name: 'locationName',
  pure: false
})
export class LocationNamePipe implements PipeTransform, OnDestroy {

  private _latestValue: string = null;
  private _latestReturnedValue: string = null;
  private _subscription: SubscriptionLike = null;
  private _id: string;

  ngOnDestroy(): void {
    // console.log('onDestroy LocationNamePipe');
    if (this._subscription) {
      this._dispose();
    }
  }

  constructor(private locationService: LocationService, private _ref: ChangeDetectorRef) {
    // console.log('new LocationNamePipe');
  }
  transform(id: string, args?: any): any {
    // console.log('LocationNamePipe.transform', id);
    if (!this._id) {
      if (id) {
        this._subscribe(id);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (id !== this._id) {
      // console.log('LocationNamePipe.transform diff id', this._id, id);
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
    // console.log('LocationNamePipe._subscribe', id);
    this._id = id;
    this._subscription = this.locationService.watchLocation(id).subscribe(loc => this._updateLatestValue(id, loc));
  }

  private _dispose(): void {
    // console.log('LocationNamePipe._dispose', this._id);
    this._subscription.unsubscribe();
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._id = null;
  }

  private _updateLatestValue(id: string, value: ILocation): void {
    // console.log('LocationNamePipe._updateLatestValue', id, value);
    if (id === this._id) {
      this._latestValue = value ? value.name : null;
      this._ref.markForCheck();
    }
  }
}
