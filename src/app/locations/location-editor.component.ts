import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ILocation } from '../location.service';

@Component({
  selector: 'app-location-editor',
  templateUrl: './location-editor.component.html',
  styleUrls: ['./location-editor.component.css']
})
export class LocationEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<ILocation>();
  @Input() loc: ILocation;
  @Input() new_mode: boolean;

  constructor() { }

  ngOnInit() {
  }

}
