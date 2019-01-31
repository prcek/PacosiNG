import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendar } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css']
})
export class CalendarPageComponent implements OnInit {
  calendar: ICalendar;
  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
    this.getCalendar();
  }
  getCalendar(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarService.getCalendar(id)
      .subscribe(cal => this.calendar = cal);
  }
  goBack(): void {
    this.location.back();
  }



}
