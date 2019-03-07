import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calendar-event-chip',
  templateUrl: './calendar-event-chip.component.html',
  styleUrls: ['./calendar-event-chip.component.css']
})
export class CalendarEventChipComponent implements OnInit {
  @Input() calendar_event_id: string;
  constructor() { }

  ngOnInit() {
  }

}
