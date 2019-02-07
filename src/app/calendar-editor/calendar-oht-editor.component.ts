import { Component, OnInit, Input } from '@angular/core';
import { ICalendar } from '../calendar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar-oht-editor',
  templateUrl: './calendar-oht-editor.component.html',
  styleUrls: ['./calendar-oht-editor.component.css']
})
export class CalendarOhtEditorComponent implements OnInit {
  @Input() calendar: ICalendar;


  ohtForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required}),
    time: new FormControl(null, { validators: Validators.required}),
    time_end: new FormControl(null, { validators: Validators.required}),
  });

  constructor() { }

  ngOnInit() {
    if (!this.calendar) {
      throw Error('A CalendarOhtEditorComponent without calendar');
    }
  }

}
