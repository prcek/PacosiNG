import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calendar-chip',
  templateUrl: './calendar-chip.component.html',
  styleUrls: ['./calendar-chip.component.css']
})
export class CalendarChipComponent implements OnInit {
  @Input() calendar_id: string;
  constructor() { }

  ngOnInit() {
  }

}
