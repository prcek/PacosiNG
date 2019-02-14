import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEventType } from '../calendar.service';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent } from '../dialogs/dialog-confirm.component';

@Component({
  selector: 'app-calendar-et-page',
  templateUrl: './calendar-et-page.component.html',
  styleUrls: ['./calendar-et-page.component.css']
})
export class CalendarEtPageComponent implements OnInit {
  calendar: ICalendar;
  event_types: ICalendarEventType[];
  displayedColumns: string[] = ['name', 'color', 'len', 'order', 'actions'];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private calendarService: CalendarService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getCalendarWithETs();
  }
  getCalendarWithETs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarService.getCalendarWithEventTypes(id)
      .subscribe(d => { this.calendar = d.calendar; this.event_types = d.event_types; });
  }
  goBack(): void {
    this.location.back();
  }
  onEdit(event_type) {
    this.router.navigate(['/calendars/et/' + event_type.calendar_id + '/edit/' + event_type._id]);
  }
  onDelete(event_type) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { title: 'Smazání typu události', content: 'opravdu smazat typ události "' + event_type.name + '" ?!' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.calendarService.deleteEventType(event_type._id)
          .subscribe(r => {
            if (r.ok) {
              this.getCalendarWithETs();
            } else {
              alert('chyba');
            }
          });
      }
    });
  }
  get diag() {
    return JSON.stringify({calendar: this.calendar, event_types: this.event_types});
  }

}
