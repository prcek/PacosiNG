import { Component, OnInit } from '@angular/core';
import { ILocation, LocationService } from '../location.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.css']
})
export class LocationPageComponent implements OnInit {

  loc: ILocation;
  constructor(private route: ActivatedRoute, private location: Location, private locationService: LocationService) { }

  ngOnInit() {
    this.getLocation();
  }
  getLocation(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.locationService.getLocation(id).subscribe(loc => this.loc = loc);
  }
  goBack(): void {
    this.location.back();
  }

}
