import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, IOpeningHours, ICalendarDaySlot } from '../calendar.service';
import * as M from 'moment';
import { MatDialog } from '@angular/material';
import { DialogPdfComponent } from '../dialogs/dialog-pdf.component';
@Component({
  selector: 'app-calendar-events-page',
  templateUrl: './calendar-events-page.component.html',
  styleUrls: ['./calendar-events-page.component.css']
})
export class CalendarEventsPageComponent implements OnInit {
  calendar: ICalendar;
  day: Date;
  events: ICalendarEvent[];
  ohs: IOpeningHours[];
  slots: ICalendarDaySlot[];
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private calendarService: CalendarService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
    this.getCalendarWithEvents();
  }
  getCalendarWithEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.calendarService.getCalendarWithEvents(id, this.day)
      .subscribe(d => {
        this.calendar = d.calendar; this.events = d.events; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }
  goBack(): void {
    this.location.back();
  }

  onPrint(): void {
    const ds = M.utc(this.day).format('YYYY-MM-DD');
    const DD = {
      content: [
        {
          text: 'Přehled dne ' + ds + ' kalendář ' + this.calendar.name,
          style: 'header'
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ 30, 'auto', 'auto', '*' ],
            body: [
              [ 'Čas', 'Typ', 'Klient', 'Poznámka' ],
              ...this.events.map(e => {
                const etime = this.calendarService.event2timestring(this.calendar, e);
                const name = e.client.last_name + ' ' + e.client.first_name;
                return [etime, e.event_name, name, e.comment];
              }),
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        }
      }
    };

    const dialogRef = this.dialog.open(DialogPdfComponent, {
      width: '100vw',
      height: '100vh',
      maxHeight: 'none',
      maxWidth: 'none',
      data: {title: 'Tisk - Přehled dne ' + ds, doc: DD}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  onSlot(slot: ICalendarDaySlot) {
    const d = M.utc(this.day).format('YYYY-MM-DD');
    if (slot.event) {
      this.router.navigate(['/calendars/events/' + this.calendar._id + '/day/' + d + '/edit/' + slot.event._id]);
    } else {
      this.router.navigate(['/calendars/events/' + this.calendar._id + '/day/' + d + '/new/' + slot.slot]);
    }

  }

  get diag() {
    return JSON.stringify({
      day: this.day,
      slots: this.slots,
      ohs: this.ohs,
      events: this.events,
      calendar: this.calendar
    });
  }
}
