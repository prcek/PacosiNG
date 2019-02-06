import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Optional,
  Inject,
  AfterViewInit,
  ElementRef,
  ViewContainerRef,
  ComponentRef,
  NgZone,
  InjectionToken} from '@angular/core';
import { TimepickerDirective } from './timepicker-input';
import { merge, Subscription, Subject } from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DOCUMENT} from '@angular/common';
import {ESCAPE, UP_ARROW} from '@angular/cdk/keycodes';
import {
  CanColor,
  CanColorCtor,
  mixinColor,
  ThemePalette,
} from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayRef, Overlay, OverlayConfig, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { take, filter } from 'rxjs/operators';
/** Used to generate a unique ID for each datepicker instance. */
let timepickerUid = 0;

/** Injection token that determines the scroll handling while the calendar is open. */
export const APP_TIMEPICKER_SCROLL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>('app-timepicker-scroll-strategy');

/** @docs-private */
export function APP_TIMEPICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const APP_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: APP_TIMEPICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: APP_TIMEPICKER_SCROLL_STRATEGY_FACTORY,
};


@Component({
  moduleId: module.id,
  selector: 'app-timepicker-content',
  templateUrl: 'timepicker-content.html',
  styleUrls: ['timepicker-content.css'],
})
// tslint:disable-next-line:component-class-suffix
export class TimepickerContent implements AfterViewInit, CanColor {

  @Input() color: ThemePalette;

  /** Reference to the datepicker that created the overlay. */
  timepicker: TimepickerComponent;

  /** Whether the datepicker is above or below the input. */
  _isAbove: boolean;

  constructor(elementRef: ElementRef) {
   // super(elementRef);
  }

  ngAfterViewInit() {
    // this._calendar.focusActiveCell();
  }
  onTest() {
    this.timepicker.select(3);
    this.timepicker.close();
  }
}

@Component({
  moduleId: module.id,
  selector: 'app-timepicker',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TimepickerComponent implements OnDestroy, CanColor {
  id = `app-timepicker-${timepickerUid++}`;
  private _scrollStrategy: () => ScrollStrategy;
  readonly _disabledChange = new Subject<boolean>();
  readonly _selectedChanged = new Subject<number>();
  _timepickerInput: TimepickerDirective;
  private _focusedElementBeforeOpen: HTMLElement | null = null;
  _color: ThemePalette;
  private _inputSubscription = Subscription.EMPTY;
  private _dialogRef: MatDialogRef<TimepickerContent> | null;
  private _popupComponentRef: ComponentRef<TimepickerContent> | null;
  private _calendarPortal: ComponentPortal<TimepickerContent>;
  _popupRef: OverlayRef;
  /** Emits when the datepicker has been opened. */
  // tslint:disable-next-line:no-output-rename
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  // tslint:disable-next-line:no-output-rename
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _dialog: MatDialog,
    private _viewContainerRef: ViewContainerRef,
    private _ngZone: NgZone,
    private _overlay: Overlay,
    @Optional() @Inject(DOCUMENT) private _document: any,
    @Inject(APP_TIMEPICKER_SCROLL_STRATEGY) scrollStrategy: any,
    ) {
      this._scrollStrategy = scrollStrategy;
    }


  get _selected(): number | null { return this._validSelected; }
  set _selected(value: number | null) { console.log('_selected', value); this._validSelected = value; }
  private _validSelected: number| null = null;

  @Input()
  get touchUi(): boolean { return this._touchUi; }
  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : this.close(); }
  private _opened = false;

  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._timepickerInput ?
        this._timepickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }
  private _disabled: boolean;

  select(value: number): void {
    const oldValue = this._selected;
    this._selected = value;
    if (oldValue !== this._selected) {
      this._selectedChanged.next(value);
    }
  }

  _registerInput(input: TimepickerDirective): void {
    if (this._timepickerInput) {
      throw Error('A TimepickerComponent can only be associated with a single input.');
    }
    this._timepickerInput = input;
    this._inputSubscription = this._timepickerInput._valueChange.subscribe((value: number | null) => this._selected = value);
  }

  open(): void {
    console.log('TimepickerComponent.open');
    if (this._opened || this.disabled) {
      return;
    }
    if (!this._timepickerInput) {
      throw Error('Attempted to open an Timepicker with no associated input.');
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }
    this.touchUi ? this._openAsDialog() : this._openAsPopup();
    this._opened = true;
    this.openedStream.emit();
  }
  close(): void {
    console.log('TimepickerComponent.close');
    if (!this._opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }

    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }

    const completeClose = () => {
    // The `_opened` could've been reset already if
    // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };
    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function') {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }


  private _openAsDialog(): void {
    // Usually this would be handled by `open` which ensures that we can only have one overlay
    // open at a time, however since we reset the variables in async handlers some overlays
    // may slip through if the user opens and closes multiple times in quick succession (e.g.
    // by holding down the enter key).
    if (this._dialogRef) {
      this._dialogRef.close();
    }

    this._dialogRef = this._dialog.open<TimepickerContent>(TimepickerContent, {
     // direction: this._dir ? this._dir.value : 'ltr',
      viewContainerRef: this._viewContainerRef,
      panelClass: 'mat-datepicker-dialog',
    });

    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.timepicker = this;
    this._setColor();
  }

  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<TimepickerContent>(TimepickerContent,
                                                                          this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      this._popupComponentRef = this._popupRef.attach(this._calendarPortal);
      this._popupComponentRef.instance.timepicker = this;
      this._setColor();

      // Update the position once the calendar has rendered.
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      // direction: this._dir,
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'mat-datepicker-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(filter(event => {
        // Closing on alt + up is only valid when there's an input associated with the datepicker.
        return event.keyCode === ESCAPE ||
               (this._timepickerInput && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(() => this.close());
  }


  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this._timepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.mat-datepicker-content') // ????!!
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }
  ngOnDestroy(): void {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();

    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupComponentRef = null;
    }
  }
  @Input()
  get color(): ThemePalette {
    return this._color ||
        (this._timepickerInput ? this._timepickerInput._getThemePalette() : undefined);
  }
  set color(value: ThemePalette) {
    this._color = value;
  }

  private _setColor(): void {
    const color = this.color;
    if (this._popupComponentRef) {
      this._popupComponentRef.instance.color = color;
    }
    if (this._dialogRef) {
      this._dialogRef.componentInstance.color = color;
    }
  }

}
