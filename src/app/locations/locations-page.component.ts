import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material';
import { ILocation, LocationService } from '../location.service';

@Component({
  selector: 'app-locations-page',
  templateUrl: './locations-page.component.html',
  styleUrls: ['./locations-page.component.css']
})
export class LocationsPageComponent implements OnInit, OnDestroy {

  opt$: Subscription;
  all: boolean;
  locations: ILocation[];
  constructor(private router: Router, private route: ActivatedRoute, private locationService: LocationService) { }

  ngOnInit() {
    console.log('LocationsPageComponent.ngOnInit');
    this.opt$ = this.route.paramMap.pipe(
      map(params => (params.get('all') === 'yes')),
      tap(all => this.all = all),
      switchMap((all: boolean) => this.locationService.getLocations(all))
    ).subscribe(locations => this.locations = locations);
  }
  ngOnDestroy(): void {
    this.opt$.unsubscribe();
  }
  onAll(event: MatSlideToggleChange) {
    this.router.navigate([{ all: event.checked ? 'yes' : 'no' }]);
  }
  get displayedColumns(): string[] {
    if (this.all) {
      return ['archived', 'name', 'address', 'actions'];
    } else {
      return ['name', 'address', 'actions'];
    }
  }

  onEdit(loc: ILocation) {
    this.router.navigate(['/locations/edit', loc._id]);
  }



}
