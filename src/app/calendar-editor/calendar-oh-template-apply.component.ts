import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ICalendar, IOpeningHours, CalendarService } from '../calendar.service';
import * as R from 'ramda';
import * as M from 'moment';


export interface Day {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-calendar-oh-template-apply',
  templateUrl: './calendar-oh-template-apply.component.html',
  styleUrls: ['./calendar-oh-template-apply.component.css']
})
export class CalendarOhTemplateApplyComponent implements OnInit, OnChanges {
  @Input() calendar: ICalendar;
  @Input() day_list: string[];
  @Output() saved = new EventEmitter<IOpeningHours[]>();
  days: Day[];
  submitted = false;
  error_msg: string;
  ohForm = new FormGroup({
    start_day: new FormControl(null, { validators: Validators.required}),
    day_count: new FormControl(28, { validators: Validators.required}),
  });
  constructor(private calendarService: CalendarService) { }
  get last_day(): string {
    if (this.ohForm.valid) {
      return M.utc(this.ohForm.value.start_day).add(this.ohForm.value.day_count - 1, 'day').format('YYYY-MM-DD');
    } else {
      return '?';
    }
  }
  ngOnInit() {
    this.days = R.map((i => ({value: i, viewValue: i})), this.day_list);
    this.ohForm.patchValue({start_day: this.days[0].value});
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    const day_list = changes.day_list;
    if (day_list && !day_list.firstChange)  {
      this.days = R.map((i => ({value: i, viewValue: i})), this.day_list);
      this.ohForm.patchValue({start_day: this.days[0].value});
    }
  }
  onSubmit(formDirective: FormGroupDirective) {


    const sm = M.utc(this.ohForm.value.start_day);
    const start_day = sm.toDate();
    const end_day = sm.add(this.ohForm.value.day_count, 'day').toDate();
    this.submitted = true;
    this.ohForm.disable();
    this.error_msg = null;
    console.log('CalendarOhTemplateApplyComponent.onSubmit');
    this.calendarService.planOpeningHours(this.calendar._id, start_day, end_day).subscribe((r) => {
      this.saved.emit(r);
      this.submitted = false;
      formDirective.resetForm();
      // this.ohForm.reset();
      this.ohForm.enable();
    }, (err) => {
      this.submitted = false;
      this.ohForm.enable();
      this.error_msg = err;
    });

  }

}