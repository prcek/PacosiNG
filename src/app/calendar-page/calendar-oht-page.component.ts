import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendar, IOpeningHoursTemplate} from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calendar-oht-page',
  templateUrl: './calendar-oht-page.component.html',
  styleUrls: ['./calendar-oht-page.component.css']
})
export class CalendarOhtPageComponent implements OnInit {
  calendar: ICalendar;
  templates: IOpeningHoursTemplate[];
  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
    this.getCalendarWithOHTs();
  }
  goBack(): void {
    this.location.back();
  }
  getCalendarWithOHTs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarService.getCalendarWithOpeningHoursTemplate(id)
      .subscribe(d => { this.calendar = d.calendar; this.templates = d.templates; });
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, templates: this.templates});
  }
}
