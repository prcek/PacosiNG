import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarService, ICalendar, IOpeningHoursTemplate } from '../calendar.service';

@Component({
  selector: 'app-calendars-page',
  templateUrl: './calendars-page.component.html',
  styleUrls: ['./calendars-page.component.css']
})
export class CalendarsPageComponent implements OnInit {
  calendars: ICalendar[];
  ohtemplates: IOpeningHoursTemplate[];
  displayedColumns: string[] = ['id', 'name', 'span', 'day_begin', 'day_len', 'week_days', 'actions'];
  constructor(private router: Router, private calendarService: CalendarService) { }

  ngOnInit() {
    this.getCalendars();
    this.getOHTemplates();
  }
  getCalendars(): void {
    this.calendarService.getCalendars()
      .subscribe(calendars => this.calendars = calendars);
  }
  getOHTemplates(): void {
    this.calendarService.getOpeningHoursTemplates()
      .subscribe(oht => this.ohtemplates = oht);
  }
  onEdit(cal: ICalendar) {
    this.router.navigate(['/calendars/edit/' + cal._id]);
  }

  onEditOH(cal: ICalendar) {
    this.router.navigate(['/calendars/oh/' + cal._id]);
  }
  onEditOHT(cal: ICalendar) {
    this.router.navigate(['/calendars/oht/' + cal._id]);
  }

}
