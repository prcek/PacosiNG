import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarService, ICalendar, IOpeningHoursTemplate } from '../calendar.service';
import { Subscription } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-calendars-page',
  templateUrl: './calendars-page.component.html',
  styleUrls: ['./calendars-page.component.css']
})
export class CalendarsPageComponent implements OnInit, OnDestroy {
  opt$: Subscription;
  all: boolean;
  calendars: ICalendar[];
  // ohtemplates: IOpeningHoursTemplate[];
  displayedColumns: string[] = ['name', 'span', 'day_begin', 'day_len', 'week_days', 'actions'];
  constructor(private router: Router, private route: ActivatedRoute, private calendarService: CalendarService) { }

  ngOnInit() {
    console.log('CalendarsPageComponent.ngOnInit');
    this.opt$ = this.route.paramMap.pipe(
      map(params => (params.get('all') === 'yes')),
      tap(all => this.all = all),
      switchMap((all: boolean) => this.calendarService.getCalendars(all))
    ).subscribe(calendars => this.calendars = calendars);
    // this.getOHTemplates();
  }
  ngOnDestroy(): void {
    this.opt$.unsubscribe();
  }
  onAll(event: MatSlideToggleChange) {
    this.router.navigate([{ all: event.checked ? 'yes' : 'no' }]);
  }
  /*
  getCalendars(): void {
    this.calendarService.getCalendars()
      .subscribe(calendars => this.calendars = calendars);
  }
  */
  /*
  getOHTemplates(): void {
    this.calendarService.getOpeningHoursTemplates()
      .subscribe(oht => this.ohtemplates = oht);
  }
  */
  onEdit(cal: ICalendar) {
    this.router.navigate(['/calendars/edit', cal._id]);
  }

  onEditOH(cal: ICalendar) {
    this.router.navigate(['/calendars/oh', cal._id]);
  }
  onEditOHT(cal: ICalendar) {
    this.router.navigate(['/calendars/oht', cal._id]);
  }
  onEditET(cal: ICalendar) {
    this.router.navigate(['/calendars/et', cal._id]);
  }

}
