import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, filter, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export interface ICalendar {
  _id: string;
  name: string;
  span: number;
}

/*
const CALENDARS: ICalendar[] = [
  { id: '1', name: 'jedna', span: 15},
  { id: '2', name: 'dva', span: 10},
  { id: '3', name: 'tri', span: 30}
];
*/

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private apollo: Apollo) { }
  getCalendars(): Observable<ICalendar[]> {
    console.log('CalendarService.getCalendars');
    return this.apollo.query<{calendars: ICalendar[]}>({
      query: gql`{ calendars { _id name span }}`,
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.calendars));
  }
  getCalendar(_id: string): Observable<ICalendar> {
    return this.getCalendars().pipe(switchMap(u => u), filter(u => u._id === _id));
  }
  updateCalendar(calendar: ICalendar): Observable<ICalendar> {
    return this.apollo.mutate<{updateCalendar: ICalendar}, ICalendar>({
      mutation: gql`
        mutation($_id: ID! $name: String $span: Int) {
          updateCalendar(_id: $_id name: $name span: $span) { _id name span }
        }
      `,
      variables: {
        ...calendar
      }
    }).pipe(tap(r => console.log('CalendarService.updateCalendar res=', r)),  map(res => res.data.updateCalendar));
  }

}
