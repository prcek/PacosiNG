import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-celendar-oht-page',
  templateUrl: './celendar-oht-page.component.html',
  styleUrls: ['./celendar-oht-page.component.css']
})
export class CelendarOhtPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
}
