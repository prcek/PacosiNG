import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as M from 'moment';
import * as R from 'ramda';

export interface ILocation {
  _id: string;
  archived: boolean;
  name: string;
  address: string;
}
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private apollo: Apollo) { }
  getLocations(all: boolean = false): Observable<ILocation[]> {
    // console.log('CalendarService.getCalendars', {all});
    return this.apollo.query<{locations: ILocation[]}>({
      query: gql`query($all:Boolean) { locations(all:$all) { _id archived name address }}`,
      variables: {all},
    }).pipe( /*tap(res => console.log('apollo res', res)),*/ map(res => res.data.locations));
  }
  getLocation(_id: string): Observable<ILocation> {
    return this.apollo.query<{location: ILocation}>({
      query: gql`query($_id:ID!) { location(_id:$_id) { _id archived name address }}`,
      variables: {_id},
    }).pipe( /* tap(res => console.log('apollo res', res)),*/ map(res => res.data.location));
  }

}
