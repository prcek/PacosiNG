import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-celendar-oh-page',
  templateUrl: './celendar-oh-page.component.html',
  styleUrls: ['./celendar-oh-page.component.css']
})
export class CelendarOhPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location, private calendarService: CalendarService) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }

}
