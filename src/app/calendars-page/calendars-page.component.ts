import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarService, ICalendar } from '../calendar.service';

@Component({
  selector: 'app-calendars-page',
  templateUrl: './calendars-page.component.html',
  styleUrls: ['./calendars-page.component.css']
})
export class CalendarsPageComponent implements OnInit {
  calendars: ICalendar[];
  displayedColumns: string[] = ['id', 'name', 'span', 'day_begin', 'day_len', 'week_days', 'actions'];
  constructor(private router: Router, private calendarService: CalendarService) { }

  ngOnInit() {
    this.getCalendars();
  }
  getCalendars(): void {
    this.calendarService.getCalendars()
        .subscribe(calendars => this.calendars = calendars);
  }
  onEdit(cal: ICalendar) {
    this.router.navigate(['/calendars/' + cal._id]);
  }
}
