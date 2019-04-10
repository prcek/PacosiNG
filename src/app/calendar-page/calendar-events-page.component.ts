import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  CalendarService,
  ICalendar,
  ICalendarEvent,
  IOpeningHours,
  ICalendarDaySlot,
  IClipBoardRecord,
  ICalendarEventType,
  ICalendarStatus,
  ICalendarDayStatus
} from '../calendar.service';
import * as M from 'moment';
import * as R from 'ramda';
import { MatDialog, MatSlideToggleChange } from '@angular/material';
import { DialogPdfComponent } from '../dialogs/dialog-pdf.component';
import { switchMap } from 'rxjs/operators';
import { Subscription, forkJoin, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { formatDate2String_S, safeString, safeNumber2String } from '../utils';
import { SessionDataService } from '../session-data.service';


export interface IOtherCalendarStatus {
  calendar: ICalendar;
  day_status: ICalendarDayStatus;
}


@Component({
  selector: 'app-calendar-events-page',
  templateUrl: './calendar-events-page.component.html',
  styleUrls: ['./calendar-events-page.component.css']
})
export class CalendarEventsPageComponent implements OnInit, OnDestroy {
  calendar: ICalendar;
  calendar_id: string;
  day: Date;
  events: ICalendarEvent[];
  event_types: ICalendarEventType[];
  allow_extra = true;
  ohs: IOpeningHours[];
  slots: ICalendarDaySlot[];
  ocs:  IOtherCalendarStatus[];
  loading = true;
  extra = false;
  sub: Subscription;
  clip: IClipBoardRecord;
  ce_sub: Subscription;
  selected_event: ICalendarEvent = null;
  cal_first_day: Date;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private calendarService: CalendarService,
    private sd: SessionDataService,
    private auth: AuthService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.cal_first_day = this.sd.main_first_day ? this.sd.main_first_day :  M().utc().startOf('isoWeek').toDate();

    this.sub = this.route.paramMap.pipe(
      switchMap( params => {
        this.loading = true;
        const day = M.utc(params.get('day')).toDate();
        this.day = day;
        this.extra = (params.get('extra') === 'yes');
        this.calendar_id = params.get('id');
        const oc_ids: string[] = R.filter<string>( (cid: string) => cid !== this.calendar_id, this.auth.userInfo.calendar_ids);
        return forkJoin(
          this.calendarService.getCalendarWithEvents(this.calendar_id, day),
          this.calendarService.getCalendarsStatus(oc_ids, day, M(day).add(1, 'day').toDate())
        );

      })
    ).subscribe(df => {
      console.log('CalendarEventsPageComponent params change!');
      const d = df[0];
      // tslint:disable-next-line:max-line-length
      this.ocs =  R.filter<IOtherCalendarStatus>( (o: IOtherCalendarStatus) => !!o.day_status, R.map<ICalendarStatus, IOtherCalendarStatus>((o: ICalendarStatus) => {
        return { calendar: o.calendar, day_status: o.days.length ? o.days[0] : null };
      }, df[1]));
      this.calendar = d.calendar; this.events = d.events; this.ohs = d.ohs; this.slots = d.slots;
      this.event_types = d.event_types;
      if (R.find<ICalendarEventType>((et) => {
        if (et.len > et.short_len) {
          return true;
        }
        return false;
      }, this.event_types)) {
        this.allow_extra = true;
      } else {
        this.allow_extra = false;
      }
      this.loading = false;
    });
    this.clip = this.calendarService.clipboardValue();
    this.ce_sub = this.calendarService.eventClipboard$.subscribe(clip => {
      this.clip = clip;
    });
   // this.day = M.utc(this.route.snapshot.paramMap.get('day')).toDate();
   // this.getCalendarWithEvents();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.ce_sub.unsubscribe();
  }
  /*
  getCalendarWithEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.calendarService.getCalendarWithEvents(id, this.day)
      .subscribe(d => {
        this.calendar = d.calendar; this.events = d.events; this.ohs = d.ohs; this.slots = d.slots;
        this.loading = false;
      });
  }*/

  onExtra(event: MatSlideToggleChange) {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['calendars', 'events', this.calendar_id, 'day', M(this.day).utc().format('YYYY-MM-DD') , { extra: event.checked ? 'yes' : 'no' }]);
  }

  goBack(): void {
    // this.location.back();
    this.router.navigate(['main']);
  }

  onCalChangeDay(d: Date) {
   // tslint:disable-next-line:max-line-length
   this.router.navigate(['calendars', 'events', this.calendar_id, 'day', M(d).utc().format('YYYY-MM-DD') , { extra: this.extra ? 'yes' : 'no' }]);
  }

  onCalMoveCal(d: Date) {
    this.cal_first_day = d;
  }
  onSelectCal(cal: ICalendar) {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['calendars', 'events', cal._id, 'day', M(this.day).utc().format('YYYY-MM-DD') , { extra: this.extra ? 'yes' : 'no' }]);
  }

  /*
  onNextDay(): void {
    // 'calendars/events/5c780c3983788bfdbf9e5b57/day/2019-03-07'
    const nd =  M(this.day).utc().add(1, 'day').format('YYYY-MM-DD'); // TODO: skip calendar off days!
    this.router.navigate(['/calendars', 'events', this.calendar._id, 'day', nd]);
  }
  onPrevDay(): void {
    const pd =  M(this.day).utc().subtract(1, 'day').format('YYYY-MM-DD');  // TODO: skip calendar off days!
    this.router.navigate(['/calendars', 'events', this.calendar._id, 'day', pd]);
  }
  */
  onPrint(): void {
    const ds = formatDate2String_S(this.day); // M.utc(this.day).format('YYYY-MM-DD');
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
            widths: [ 30, 'auto', 'auto', 'auto', 'auto', '*' ],
            body: [
              [ 'Čas', 'Typ', 'Klient', 'Ročník', 'Telefon', 'Poznámka' ],
              ...this.events.map(e => {
                const etime = this.calendarService.event2timestring(this.calendar, e);
                const name = e.client.last_name + ' ' + e.client.first_name;
                return [etime, e.event_name, name, safeNumber2String(e.client.year), safeString(e.client.phone), safeString(e.comment)];
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
      },
      paperSize: 'A4'
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

  onSlotEdit(slot: ICalendarDaySlot) {
    const d = M.utc(this.day).format('YYYY-MM-DD');
    const as_edit =  (!this.extra && !!slot.event ) || (this.extra && !!slot.event && !slot.event_s_leg);
    console.log('as_edit', as_edit);
    if /*(slot.event && !slot.event_s_leg)*/ (as_edit) {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['calendars', 'events', this.calendar._id, 'day', d, 'edit', slot.event._id,  { extra: this.extra ? 'yes' : 'no' }]);
    } else {
      if (this.clip) {
        // alert('paste todo!');
        // tslint:disable-next-line:max-line-length
        this.router.navigate(['calendars', 'events', this.calendar._id, 'day', d,  'paste', slot.slot, { extra: this.extra ? 'yes' : 'no' }]);
      } else {
        this.router.navigate(['calendars', 'events', this.calendar._id, 'day', d,  'new', slot.slot, { extra: this.extra ? 'yes' : 'no' }]);
      }
    }

  }
  onSlotMove(slot: ICalendarDaySlot) {
    this.calendarService.clipboardCut(this.calendar, slot.event);
    this.router.navigate(['/main']);
  }
  onSlotView(slot: ICalendarDaySlot) {
    this.selected_event = slot.event;
  }

  onSlot(slot: ICalendarDaySlot) {
    if (slot.empty && this.auth.accessCheck('edit')) {
      this.onSlotEdit(slot);
    } if (this.extra && slot.extra_slot && this.auth.accessCheck('edit')) {
      this.onSlotEdit(slot);
    } else if (!slot.empty && !slot.extra_slot && this.auth.accessCheck('view')) {
      this.onSlotView(slot);
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
