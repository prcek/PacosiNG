import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService, IClipBoardRecord } from '../calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar-event-clip',
  templateUrl: './calendar-event-clip.component.html',
  styleUrls: ['./calendar-event-clip.component.css']
})
export class CalendarEventClipComponent implements OnInit, OnDestroy {
  sub: Subscription;
  clip: IClipBoardRecord;
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.clip = this.calendarService.clipboardValue();
    this.sub = this.calendarService.eventClipboard$.subscribe( c => {
      console.log('CalendarEventClipComponent', c);
      this.clip = c;
    });
  }
  ngOnDestroy(): void {
   this.sub.unsubscribe();
  }
  onClear() {
    this.calendarService.clipboardClear();
  }
}
