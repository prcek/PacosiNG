import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CalendarService, ICalendar } from '../calendar.service';
@Component({
  selector: 'app-user-new-page',
  templateUrl: './user-new-page.component.html',
  styleUrls: ['./user-new-page.component.css']
})
export class UserNewPageComponent implements OnInit {
  calendars: ICalendar[];
  constructor(private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
    this.calendarService.getCalendars().subscribe(cals => this.calendars = cals);
  }

  goBack(): void {
    this.location.back();
  }
}
