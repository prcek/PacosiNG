import { Component, OnInit, Input } from '@angular/core';
import { ICalendarDayStatus } from '../calendar.service';

@Component({
  selector: 'app-calendar-day-box',
  templateUrl: './calendar-day-box.component.html',
  styleUrls: ['./calendar-day-box.component.css']
})
export class CalendarDayBoxComponent implements OnInit {
  @Input() status: ICalendarDayStatus;
  @Input() plan_mode: boolean;
  constructor() { }

  ngOnInit() {
  }
  get variant(): string {
    if (this.status) {

      if (this.plan_mode) {
        if (!this.status.any_ohs) {
          return 'p_off';
        } else {
          return 'p_on';
        }
      } else {
        if (!this.status.any_ohs) {
          return 'off';
        }
        if (this.status.any_free) {
          return 'free';
        }
        /*
        if (this.status.any_extra_free) {
          return 'extra_free';
        }
        */
        if (this.status.any_extra) {
          return 'any_extra';
        }

        return 'busy';
      }
    }
    return 'none';
  }

}
