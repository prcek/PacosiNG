import { Directive, OnDestroy, forwardRef, EventEmitter, Input, ElementRef, HostListener, Optional } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
 } from '@angular/forms';

import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

export const APP_FIRSTUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FirstUpDirective),
  multi: true
};


function upfirst(old_value: string, new_value: string): string {
  if (old_value === '' && new_value && new_value.length === 1) {
   // console.log('upfirst - do', new_value.toUpperCase());
    return new_value.toUpperCase();
  } else if (old_value && old_value.length === 1 && new_value && new_value.length === 1) {
   // console.log('upfirst - do2', new_value.toUpperCase());
    return new_value.toUpperCase();
  }
  // console.log('upfirst - skip');
  return new_value;
}

@Directive({
  selector: 'input[appFirstUp]',
  providers: [
    APP_FIRSTUP_VALUE_ACCESSOR,
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: FirstUpDirective},
  ]
})
export class FirstUpDirective implements ControlValueAccessor, OnDestroy {

  _valueChange = new EventEmitter<string | null>();
  _disabledChange = new EventEmitter<boolean>();
  private _disabled: boolean;
  private _value: string | null;
  private _cvaOnChange: (value: any) => void = () => {};
  private _validatorOnChange = () => {};
  _onTouched = () => {};
  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
  ) {}

  writeValue(value: string): void {
    // console.log('FirstUpDirective.writeValue', value);
    this.value = value;
  }

  private _formatValue(value: string| null) {
    // console.log('FirstUpDirective._formatValue', value);
    if (value !== null) {
      this._elementRef.nativeElement.value = value;
    } else {
      this._elementRef.nativeElement.value = '';
    }
  }
  @Input()
  get value(): string | null {
    // console.log('FirstUpDirective.value get', this._value);
    return this._value;
  }
  set value(value: string | null) {
    // console.log('FirstUpDirective.value set', this._value);
    const old_value = this._value;
    this._value = value;
    this._formatValue(value);
    if (old_value !== value) {
      this._valueChange.emit(value);
    }
  }
  @HostListener('input', ['$event.target.value'])
  _onInput(value: string) {
    // console.log('_onInput', value);
    const val = upfirst(this._value, value);
    if (val !== this._value) {
      this._formatValue(val);
      this._value = val;
      this._cvaOnChange(val);
      this._valueChange.emit(val);
    } else {
      this._validatorOnChange();
    }

  }

  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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

  @HostListener('blur')
  _onBlur() {
    // console.log('_onBlur');
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }
  ngOnDestroy(): void {
    this._valueChange.complete();
    this._disabledChange.complete();
  }


}
