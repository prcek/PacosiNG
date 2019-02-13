import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-new-page',
  templateUrl: './user-new-page.component.html',
  styleUrls: ['./user-new-page.component.css']
})
export class UserNewPageComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }
}
