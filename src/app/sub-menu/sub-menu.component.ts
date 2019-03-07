import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IClipBoardRecord, CalendarService } from '../calendar.service';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() showBack: boolean;
  @Input() showEventClip: boolean;
  @Output() back = new EventEmitter();
  clip_sub: Subscription;
  clip: IClipBoardRecord;
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.clip = this.calendarService.clipboardValue();
    this.clip_sub = this.calendarService.eventClipboard$.subscribe( c => {
      this.clip = c;
    });
  }
  ngOnDestroy(): void {
    this.clip_sub.unsubscribe();
  }
  onClearClip() {
    this.calendarService.clipboardClear();
  }
  goBack(event) {
    this.back.emit(event);
  }
}
