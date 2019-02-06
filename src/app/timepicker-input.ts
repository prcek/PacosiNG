import { Directive, ElementRef, Input, OnDestroy, HostListener, forwardRef, EventEmitter, Output, Optional } from '@angular/core';
import {
  ControlValueAccessor,
  Validator,
  ValidationErrors,
  AbstractControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidatorFn,
  Validators } from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';


export const APP_TIMEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimepickerDirective),
  multi: true
};

/** @docs-private */
export const APP_TIMEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TimepickerDirective),
  multi: true
};

export class TimepickerInputEvent {
  /** The new value for the target timepicker input. */
  value: number | null;

  constructor(
    /** Reference to the timepicker input component that emitted the event. */
    public target: TimepickerDirective,
    /** Reference to the native input element associated with the datepicker input. */
    public targetElement: HTMLElement) {
    this.value = this.target.value;
  }
}

@Directive({
  selector: 'input[appTimepicker]',
  providers: [
    APP_TIMEPICKER_VALUE_ACCESSOR,
    APP_TIMEPICKER_VALIDATORS,
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: TimepickerDirective},
  ]
})
export class TimepickerDirective implements ControlValueAccessor, OnDestroy, Validator {
  _valueChange = new EventEmitter<number | null>();
  _disabledChange = new EventEmitter<boolean>();
  @Output() readonly timeChange: EventEmitter<TimepickerInputEvent> =
      new EventEmitter<TimepickerInputEvent>();
  @Output() readonly timeInput: EventEmitter<TimepickerInputEvent> =
      new EventEmitter<TimepickerInputEvent>();
  private _value: number | null;
  @Input() timeSpan = 5;
  private _lastValueValid = false;
  private _disabled: boolean;
  private _validator: ValidatorFn | null;
  private _cvaOnChange: (value: any) => void = () => {};
  private _validatorOnChange = () => {};
  _onTouched = () => {};


  constructor(
      private _elementRef: ElementRef<HTMLInputElement>,
      @Optional() private _formField: MatFormField
    ) {
    console.log('TimepickerDirective.constructor', this.appTimepicker);
    this._validator = Validators.compose([this._parseValidator]);
  }

  @Input()
  set appTimepicker(value: string) {
    console.log('TimepickerDirective.appTimepicker', value);
  }


  @Input()
  get disabled(): boolean { return !!this._disabled; }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }

    // We need to null check the `blur` method, because it's undefined during SSR.
    if (newValue && element.blur) {
      // Normally, native input elements automatically blur if they turn disabled. This behavior
      // is problematic, because it would mean that it triggers another change detection cycle,
      // which then causes a changed after checked error if the input element was focused before.
      element.blur();
    }
  }


  @Input()
  get value(): number | null {
    console.log('TimepickerDirective.value get', this._value);
    return this._value;
  }
  set value(value: number | null) {
    console.log('TimepickerDirective.value set', this._value);
    const old_value = this._value;
    this._value = value;
    this._formatValue(value);
    this._lastValueValid = true;
    console.log('_lastValueValid set', this._lastValueValid);
    if (old_value !== value) {
      this._valueChange.emit(value);
    }
  }


  @HostListener('input', ['$event.target.value'])
  _onInput(value: string) {
    console.log('_onInput', value);
    const val = this._parseValue(value);
    console.log('_onInput pv', val);
    this._lastValueValid = this._checkValue(value);
    console.log('_lastValueValid set', this._lastValueValid);
    if (val !== this._value) {
      this._value = val;
      this._cvaOnChange(val);
      this._valueChange.emit(val);
      this.timeInput.emit(new TimepickerInputEvent(this, this._elementRef.nativeElement));
    } else {
      this._validatorOnChange();
    }

  }
  @HostListener('change')
  _onChange() {
    console.log('_onChange');
    this.timeChange.emit(new TimepickerInputEvent(this, this._elementRef.nativeElement));
  }
  @HostListener('blur')
  _onBlur() {
    console.log('_onBlur');
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }
  @HostListener('keydown', ['$event'])
  _onKeydown(event: KeyboardEvent) {
    console.log('_onKeydown');
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this._valueChange.complete();
    this._disabledChange.complete();
  }
  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }
  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    console.log('_parseValidator', this._lastValueValid);
    return this._lastValueValid ?
        null : {'appTimepickerParse': {'text': this._elementRef.nativeElement.value}};
  }

  private _parseValue(value: string | null): number | null {
    if (value) {
      const tp = value.match(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/);
      if (tp) {
        const v = parseInt(tp[1], 10) * 60 + parseInt(tp[2], 10);
        if (v % this.timeSpan) {
          return null;
        }
        return v / this.timeSpan;
      }
    }

    return null;
  }
  private _checkValue(value: string | null): boolean {
    if ((value == null) || (value.length === 0) || this._parseValue(value)) {
      return true;
    }
    return false;
  }
  private _formatValue(value: number| null) {
    if (value !== null) {
      const time = (value * this.timeSpan);
      const minutes = time % 60;
      const hours = (time - minutes) / 60;
      const H = hours.toString().padStart(2, '0');
      const M = minutes.toString().padStart(2, '0');
      this._elementRef.nativeElement.value = H + ':' + M;
    } else {
      this._elementRef.nativeElement.value = '';
    }
  }
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }
  _getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }
}
