import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CalendarService, ICalendarEventType, ICalendar } from '../calendar.service';

@Component({
  selector: 'app-calendar-et-editor',
  templateUrl: './calendar-et-editor.component.html',
  styleUrls: ['./calendar-et-editor.component.css']
})
export class CalendarEtEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<ICalendarEventType>();
  @Input() calendar: ICalendar;
  @Input() event_type: ICalendarEventType;
  @Input() new_mode: boolean;


  etForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required}),
    match_key: new FormControl(''),
    color: new FormControl('', { validators: Validators.required}),
    len: new FormControl(1, { validators: [Validators.required, Validators.min(1), Validators.max(60)]}),
    order: new FormControl(1, { validators: [Validators.required, Validators.min(0), Validators.max(1000)]}),
  });
  error_msg: string;
  submitted = false;

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    if (this.new_mode) {

    } else {
      this.etForm.setValue({
        name: this.event_type.name,
        color: this.event_type.color,
        match_key: this.event_type.match_key,
        len: this.event_type.len,
        order: this.event_type.order,
      });
    }
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.new_mode) {
     const n: ICalendarEventType = {_id: null, calendar_id: this.calendar._id, ...this.etForm.getRawValue()};
     this.submitted = true;
     this.etForm.disable();
     this.error_msg = null;
     console.log('CalendarEtEditorComponent.onSubmit (newmode)', n);
     this.calendarService.createEventType(n).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       formDirective.resetForm();
       this.etForm.enable();
       this.etForm.reset();
     }, (err) => {
       this.submitted = false;
       this.etForm.enable();
       this.error_msg = err;
     });
    } else {
     const u: ICalendarEventType = {_id: this.event_type._id, ...this.etForm.getRawValue()};
     this.submitted = true;
     this.etForm.disable();
     this.error_msg = null;
     console.log('CalendarEtEditorComponent.onSubmit', u);
     this.calendarService.updateEventType(u).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       this.etForm.enable();
     }, (err) => {
       this.submitted = false;
       this.etForm.enable();
       this.error_msg = err;
     });
    }
 }

}
