import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-diag',
  templateUrl: './diag.component.html',
  styleUrls: ['./diag.component.css']
})
export class DiagComponent implements OnInit {
  dev_mode: boolean;
  constructor() {
    this.dev_mode = !environment.production;
  }
  ngOnInit() {
  }

}
