import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
  @Input() title: string;
  @Input() showBack: boolean;
  @Output() back = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  goBack(event) {
    this.back.emit(event);
  }
}
