import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendar, CalendarService } from '../calendar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeekDay, ALL_WEEK_DAYS } from './common';
import { LocationService, ILocation } from '../location.service';




@Component({
  selector: 'app-calendar-editor',
  templateUrl: './calendar-editor.component.html',
  styleUrls: ['./calendar-editor.component.css']
})
export class CalendarEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<ICalendar>();
  @Input() calendar: ICalendar;
  @Input() new_mode: boolean;


  week_days = ALL_WEEK_DAYS;


  calendarForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required}),
    location_id: new FormControl(null, {validators: Validators.required}),
    span: new FormControl(10, { validators: [Validators.required, Validators.min(5), Validators.max(60)]}),
    cluster_len: new FormControl(2, { validators: [Validators.required, Validators.min(1), Validators.max(10)]}),
    day_begin: new FormControl(7 * 4, { validators: [Validators.required, Validators.min(0), Validators.max(60)]}),
    day_len: new FormControl(10 * 4, { validators: [Validators.required, Validators.min(1), Validators.max(100)]}),
    day_offset: new FormControl(10, { validators: [Validators.required, Validators.min(5), Validators.max(30)]}),
    week_days: new FormControl([1, 2, 3, 4, 5], {validators: Validators.required}),
    print_info: new FormControl(''),
    archived: new FormControl(false),
  });
  error_msg: string;
  submitted = false;

  all_locs: ILocation[] = null;

  constructor(private calendarService: CalendarService, private locationService: LocationService) { }

  ngOnInit() {
    console.log('CalendarEditorComponent.ngOnInit', this.calendar, this.new_mode);
    this.locationService.getLocations().subscribe(locs => this.all_locs = locs);

    if (this.new_mode) {

    } else {
      this.calendarForm.setValue({
        name: this.calendar.name,
        location_id: this.calendar.location_id,
        span: this.calendar.span,
        cluster_len: this.calendar.cluster_len,
        day_begin: this.calendar.day_begin,
        day_len: this.calendar.day_len,
        day_offset: this.calendar.day_offset,
        week_days: this.calendar.week_days,
        archived: this.calendar.archived,
        print_info: this.calendar.print_info,
      });
    }
  }

  onSubmit() {
     // TODO: Use EventEmitter with form value
     if (this.new_mode) {
      const nc: ICalendar = {_id: null, ...this.calendarForm.getRawValue()};
      this.submitted = true;
      this.calendarForm.disable();
      this.error_msg = null;
      console.log('CalendarEditorComponent.onSubmit (newmode)', nc);
      this.calendarService.createCalendar(nc).subscribe((r) => {
        this.saved.emit(r);
        this.submitted = false;
        this.calendarForm.enable();
      }, (err) => {
        this.submitted = false;
        this.calendarForm.enable();
        this.error_msg = err;
      });
     } else {
      const uc: ICalendar = {_id: this.calendar._id, ...this.calendarForm.getRawValue()};
      this.submitted = true;
      this.calendarForm.disable();
      this.error_msg = null;
      console.log('CalendarEditorComponent.onSubmit', uc);
      this.calendarService.updateCalendar(uc).subscribe((r) => {
        this.saved.emit(r);
        this.submitted = false;
        this.calendarForm.enable();
      }, (err) => {
        this.submitted = false;
        this.calendarForm.enable();
        this.error_msg = err;
      });
     }
  }

}
