import { Component, OnInit, Input } from '@angular/core';
import { ICalendarDayStatus } from '../calendar.service';

@Component({
  selector: 'app-calendar-day-box',
  templateUrl: './calendar-day-box.component.html',
  styleUrls: ['./calendar-day-box.component.css']
})
export class CalendarDayBoxComponent implements OnInit {
  @Input() status: ICalendarDayStatus;
  constructor() { }

  ngOnInit() {
  }
  get variant(): string {
    if (this.status) {
      if (!this.status.any_ohs) {
        return 'off';
      }
      if (this.status.any_free) {
        return 'free';
      }
      return 'busy';
    }
    return 'none';
  }

}
