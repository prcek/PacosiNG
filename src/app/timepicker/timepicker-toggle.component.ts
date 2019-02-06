import {
  Component,
  AfterContentInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ViewChild,
  Attribute,
  ChangeDetectorRef} from '@angular/core';
import {merge, of as observableOf, Subscription} from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {TimepickerComponent} from './timepicker.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-timepicker-toggle',
  templateUrl: './timepicker-toggle.component.html',
  styleUrls: ['./timepicker-toggle.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,

  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'class': 'mat-datepicker-toggle',
    // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
    // consumer may have provided, while still being able to receive focus.
    '[attr.tabindex]': '-1',
    '[class.mat-datepicker-toggle-active]': 'timepicker && timepicker.opened',
    '[class.mat-accent]': 'timepicker && timepicker.color === "accent"',
    '[class.mat-warn]': 'timepicker && timepicker.color === "warn"',
    '(focus)': '_button.focus()',
  },
})
export class TimepickerToggleComponent implements AfterContentInit, OnChanges, OnDestroy  {
  private _stateChanges = Subscription.EMPTY;
  // tslint:disable-next-line:no-input-rename
  @Input('for') timepicker: TimepickerComponent;
  @Input() tabIndex: number | null;
  constructor(private _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') defaultTabIndex: string) {

    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
  }
  @Input() disableRipple: boolean;
  @ViewChild('button') _button: MatButton;
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined ? this.timepicker.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    console.log('TimepickerToggleComponent.disabled set', value);
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.datepicker) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }


  _open(event: Event): void {
    if (this.timepicker && !this.disabled) {
      this.timepicker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const timepickerDisabled = this.timepicker ? this.timepicker._disabledChange : observableOf();
    const inputDisabled = this.timepicker && this.timepicker._timepickerInput ?
        this.timepicker._timepickerInput._disabledChange : observableOf();
    const timepickerToggled = this.timepicker ?
        merge(this.timepicker.openedStream, this.timepicker.closedStream) :
        observableOf();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      timepickerDisabled,
      inputDisabled,
      timepickerToggled
    ).subscribe(() => { console.log('markForCheck', this); this._changeDetectorRef.markForCheck(); });
  }
}
