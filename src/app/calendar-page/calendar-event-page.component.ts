import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarService, ICalendar, ICalendarEvent, ICalendarEventType, ICalendarDaySlot } from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent } from '../dialogs/dialog-confirm.component';
import { DialogPdfComponent } from '../dialogs/dialog-pdf.component';
import { CLR_LOGO } from '../pdf/pdf_data';


@Component({
  selector: 'app-calendar-event-page',
  templateUrl: './calendar-event-page.component.html',
  styleUrls: ['./calendar-event-page.component.css']
})
export class CalendarEventPageComponent implements OnInit {
  calendar: ICalendar;
  event: ICalendarEvent;
  event_types: ICalendarEventType[];
  slots: ICalendarDaySlot[];
  day: Date;
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private calendarService: CalendarService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
    this.getCalendarWithEvent();
  }

  get free_slots(): number[] {
    if (this.slots) {
      return R.map<ICalendarDaySlot, number>(s => s.slot, R.filter<ICalendarDaySlot>(s => {
        if (s.empty) {
          return true;
        }
        if (s.event && this.event && s.event._id === this.event._id) {
          return true;
        }
        return false;
      }, this.slots));
    }
    return [];
  }

  getCalendarWithEvent() {
    const id = this.route.snapshot.paramMap.get('id');
    const event_id = this.route.snapshot.paramMap.get('e_id');
    this.loading = true;
    this.calendarService.getCalendarWithEvent(id, this.day, event_id)
      .subscribe(d => {
        this.calendar = d.calendar;
        this.event = d.event;
        this.event_types = d.event_types;
        this.slots = d.slots;
        // this.events = d.event; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }
  onDelete() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { title: 'Smazání události', content: 'opravdu smazat událost?!' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.calendarService.deleteEvent(this.event._id)
          .subscribe(r => {
            if (r.ok) {
              this.location.back();
              // this.getCalendarWithEvent();
            } else {
              alert('chyba');
            }
          });
      }
    });
  }

  onCopy(): void {
    this.calendarService.clipboardCopy(this.calendar, this.event);
  }
  onCut(): void {
    this.calendarService.clipboardCut(this.calendar, this.event);
  }

  goBack(): void {
    this.location.back();
  }

  onPrint(): void {
    const ds = M.utc(this.day).format('YYYY-MM-DD');
    const client = this.event.client.last_name + ' ' + this.event.client.first_name;
    const etime = this.calendarService.event2timestring(this.calendar, this.event);
    const DD = {
      content: [
        {
          image: CLR_LOGO,
          width: 200,
        },
        {
          text: client,
          style: 'header'
        },
        {
          text: 'Datum: ' + ds
        },
        {
          text: 'Čas: ' + etime
        },
        {
          text: 'PROSÍME O PŘÍCHOD 15 MIN. DŘÍVE NEŽ JE UVEDENÝ ČAS OBJEDNÁVKY K LÉKAŘI.'
        },
        {
          text: 'PŘED VSTUPEM DO ORDINACE JE POTŘEBA SE NAHLÁSIT V EVIDENCI K ZAPSÁNÍ DO AMBULANTNÍ KARTY.'
        },
        {
          text: this.calendar.name,
          style: 'header'
        },
        {
          text: 'S sebou poukaz na vyšetření/ošetření, pojišťovací kartičku, zdravotní dokumentaci k diagnoze.'
        },
        {
          text: 'www.clr.cz, Viniční 235, 615 00 Brno, tel.: 533 306 376'
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
      },
      pageSize: 'A5'
    };
    const dialogRef = this.dialog.open(DialogPdfComponent, {
      width: '100vw',
      height: '100vh',
      maxHeight: 'none',
      maxWidth: 'none',
      data: {title: 'Tisk - Objednavka' + ds, doc: DD}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  get diag() {
    return JSON.stringify({calendar: this.calendar, event: this.event});
  }

}
