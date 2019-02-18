import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar-events-page',
  templateUrl: './calendar-events-page.component.html',
  styleUrls: ['./calendar-events-page.component.css']
})
export class CalendarEventsPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private calendarService: CalendarService) {}

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
}
