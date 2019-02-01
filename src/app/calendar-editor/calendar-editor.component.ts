import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendar, CalendarService } from '../calendar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar-editor',
  templateUrl: './calendar-editor.component.html',
  styleUrls: ['./calendar-editor.component.css']
})
export class CalendarEditorComponent implements OnInit {
  @Output() updated = new EventEmitter<ICalendar>();
  @Input() calendar: ICalendar;


  calendarForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required}),
    span: new FormControl(15, { validators: [Validators.required, Validators.min(5), Validators.max(60)]}),
  });
  error_msg: string;
  submitted = false;


  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    console.log('CalendarEditorComponent.ngOnInit', this.calendar);
    this.calendarForm.setValue({
      name: this.calendar.name,
      span: this.calendar.span
    });
  }

  onSubmit() {
     // TODO: Use EventEmitter with form value
     const uc: ICalendar = {id: this.calendar.id, ...this.calendarForm.getRawValue()};
     this.submitted = true;
     this.calendarForm.disable();
     this.error_msg = null;
     console.log('CalendarEditorComponent.onSubmit', uc);
     this.calendarService.updateCalendar(uc).subscribe((r) => {
       this.updated.emit(r);
       this.submitted = false;
       this.calendarForm.enable();
     }, (err) => {
       this.submitted = false;
       this.calendarForm.enable();
       this.error_msg = err;
     });
  }

}
