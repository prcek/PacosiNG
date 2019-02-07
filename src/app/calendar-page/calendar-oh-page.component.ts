import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calendar-oh-page',
  templateUrl: './calendar-oh-page.component.html',
  styleUrls: ['./calendar-oh-page.component.css']
})
export class CalendarOhPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }

}
