import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-daycard',
  templateUrl: './daycard.component.html',
  styleUrls: ['./daycard.component.css']
})
export class DaycardComponent implements OnInit {
  @Input() date: Date;
  @Input() small: boolean;
  dayNames = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

  constructor() { }

  ngOnInit() {
    this.small = this.small !== undefined;
  }
  get month() {
    if (this.date) {
      return this.monthNames[this.date.getMonth()];
    }
  }
  get day(): string {
    if (this.date) {
      return '' + this.date.getDate();
    }
    return '?';
  }
  get week_day(): string {
    if (this.date) {
      return this.dayNames[this.date.getDay()];
    }
    return '?';
  }
}
