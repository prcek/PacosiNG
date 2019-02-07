import { Component, OnInit } from '@angular/core';
import { CalendarService, ICalendar, IOpeningHoursTemplate} from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as R from 'ramda';
interface IOHTGroup {
  week_day: number;
  templates: IOpeningHoursTemplate[];
}

function t2g(ts: IOpeningHoursTemplate[]): IOHTGroup[] {
  const tog = (val: IOpeningHoursTemplate[], key: string) => ({week_day: parseInt(key, 10), templates: val});
  const x = R.values(R.mapObjIndexed(tog, R.groupBy<IOpeningHoursTemplate>(R.prop('week_day'), ts)));
  // console.log(x);
  return x;
}

@Component({
  selector: 'app-calendar-oht-page',
  templateUrl: './calendar-oht-page.component.html',
  styleUrls: ['./calendar-oht-page.component.css']
})
export class CalendarOhtPageComponent implements OnInit {
  calendar: ICalendar;
  templates: IOpeningHoursTemplate[];
  template_groups: IOHTGroup[];
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
      .subscribe(d => { this.calendar = d.calendar; this.templates = d.templates; this.template_groups = t2g(d.templates); });
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, templates: this.templates});
  }
}
