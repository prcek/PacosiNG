import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICalendar } from '../calendar.service';
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
  });
  error_msg: string;
  submitted = false;


  constructor() { }

  ngOnInit() {
    console.log('CalendarEditorComponent.ngOnInit', this.calendar);
    this.calendarForm.setValue({
      name: this.calendar.name,
    });
  }

  onSubmit() {
    alert('todo');
  }

}
