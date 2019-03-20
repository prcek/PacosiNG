import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar-event-search-page',
  templateUrl: './calendar-event-search-page.component.html',
  styleUrls: ['./calendar-event-search-page.component.css']
})
export class CalendarEventSearchPageComponent implements OnInit {
  search_string = '';
  submitted = false;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
  onSearch(event) {
    alert('onSearch' +  JSON.stringify(event));
  }
}
