import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calendar-new-page',
  templateUrl: './calendar-new-page.component.html',
  styleUrls: ['./calendar-new-page.component.css']
})
export class CalendarNewPageComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
}
