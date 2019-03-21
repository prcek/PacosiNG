import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-event-search',
  templateUrl: './calendar-event-search.component.html',
  styleUrls: ['./calendar-event-search.component.css']
})
export class CalendarEventSearchComponent implements OnInit {
  @Input() submitted: boolean;
  @Input() init_val: string;
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
    if (this.init_val) {
      this.search_string = this.init_val;
    }
  }
  onSubmit() {
    this.search.emit(this.search_string);
  }
}
