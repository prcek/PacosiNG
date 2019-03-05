import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-location-new-page',
  templateUrl: './location-new-page.component.html',
  styleUrls: ['./location-new-page.component.css']
})
export class LocationNewPageComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }

}
