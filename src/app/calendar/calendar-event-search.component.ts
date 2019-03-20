import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-event-search',
  templateUrl: './calendar-event-search.component.html',
  styleUrls: ['./calendar-event-search.component.css']
})
export class CalendarEventSearchComponent implements OnInit {
  @Input() submitted: boolean;
  @Output() search = new EventEmitter<string>();
  search_string = '';
  constructor() { }
  get empty(): boolean {
    if (this.search_string && this.search_string.trim().length) {
      return false;
    }
    return true;
  }
  ngOnInit() {
  }
  onSubmit() {
    this.search.emit(this.search_string);
  }
}
