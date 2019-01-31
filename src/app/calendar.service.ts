import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

export interface ICalendar {
  id: string;
  name: string;
  span: number;
}

const CALENDARS: ICalendar[] = [
  { id: '1', name: 'jedna', span: 15},
  { id: '2', name: 'dva', span: 10},
  { id: '3', name: 'tri', span: 30}
];

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }
  getCalendars(): Observable<ICalendar[]> {
    return of(CALENDARS);
  }
  getCalendar(id: string): Observable<ICalendar> {
    return this.getCalendars().pipe(switchMap(u => u), filter(u => u.id === id));
  }
  updateCalendar(calendar: ICalendar): Observable<ICalendar> {
    return of(calendar);
  }
}
