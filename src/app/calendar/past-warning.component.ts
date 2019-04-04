import { Component, OnInit, Input } from '@angular/core';
import * as M from 'moment';
@Component({
  selector: 'app-past-warning',
  templateUrl: './past-warning.component.html',
  styleUrls: ['./past-warning.component.css']
})
export class PastWarningComponent implements OnInit {
  @Input() day: Date | string;
  constructor() { }

  ngOnInit() {
  }
  get inThePast(): boolean {
    return M.utc(this.day).startOf('day').isBefore(M.utc().startOf('day'));
  }
}
