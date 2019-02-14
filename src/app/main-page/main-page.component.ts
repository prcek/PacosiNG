import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import * as M from 'moment';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  test: any;
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    const now = M().startOf('day');

    this.calendarService.getCalendarsStatus(now.toDate(), M(now).add(10, 'days').toDate()).subscribe(r => this.test = r);
  }


}
