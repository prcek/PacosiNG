import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICalendar, ICalendarEvent, CalendarService } from '../calendar.service';
import { MatDialog } from '@angular/material';
import * as M from 'moment';
import { DialogPdfComponent } from '../dialogs/dialog-pdf.component';

@Component({
  selector: 'app-calendar-event-view',
  templateUrl: './calendar-event-view.component.html',
  styleUrls: ['./calendar-event-view.component.css']
})
export class CalendarEventViewComponent implements OnInit {
  @Input() calendar: ICalendar;
  @Input() event: ICalendarEvent;
  @Output() close = new EventEmitter<void>();
  constructor(
    private calendarService: CalendarService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }
  onClose() {
    this.close.emit();
  }

  onPrint(): void {
    const ds = M.utc(this.event.day).format('YYYY-MM-DD');
    this.calendarService.event2pdf(this.calendar, this.event).subscribe(dd => {
      const dialogRef = this.dialog.open(DialogPdfComponent, {
        width: '100vw',
        height: '100vh',
        maxHeight: 'none',
        maxWidth: 'none',
        data: {title: 'Tisk - Objednávka ' + ds, doc: dd}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    });
  }

}
