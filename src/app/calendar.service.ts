import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, filter, map, tap, delay } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as M from 'moment';
import * as R from 'ramda';

export interface ICalendar {
  _id: string;
  name: string;
  span: number;
  day_begin: number;
  day_len: number;
  week_days: number[];
}

export interface ICalendarEventType {
  _id: string;
  calendar_id: string;
  name: string;
  color: string;
  len: number;
  order: number;
}

export interface IOpeningHoursTemplate {
  _id: string;
  calendar_id: string;
  week_day: number;
  begin: number;
  len: number;
}


export interface IOpeningHours {
  _id: string;
  calendar_id: string;
  day: Date;
  begin: number;
  len: number;
}
export interface IOpeningHoursV extends IOpeningHours {
  day_as_string: string;
}

export interface ICalendarWithOpeningHoursTemplates {
  calendar: ICalendar;
  templates: IOpeningHoursTemplate[];
}

export interface ICalendarWithOpeningHours {
  calendar: ICalendar;
  ohs: IOpeningHours[];
}

export interface ICalendarWithEventTypes {
  calendar: ICalendar;
  event_types: ICalendarEventType[];
}

export interface ICalendarWithEventType {
  calendar: ICalendar;
  event_type: ICalendarEventType;
}

export interface IDeleteResponse {
  ok: boolean;
  _id: string;
}
export interface ICalendarDayStatus {
  day: Date;
  any_ohs: boolean;
}
export interface ICalendarStatus {
  calendar: ICalendar;
  days: ICalendarDayStatus[];
}
export interface ICalendarStatusR {
  calendar_id: string;
  days: ICalendarDayStatus[];
}
export interface ICalendarDayStatusE extends ICalendarDayStatus {
  calendar_id: string;
}
export interface ICalendarsStatusRow {
  day: Date;
  statuses: ICalendarDayStatusE[];
}
export interface ICalendarGridInfo {
  calendars: ICalendar[];
  days: ICalendarsStatusRow[];
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
      query: gql`{ calendars { _id name span day_begin day_len week_days }}`,
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.calendars));
  }
  getCalendar(_id: string): Observable<ICalendar> {
    return this.getCalendars().pipe(switchMap(u => u), filter(u => u._id === _id));
  }
  updateCalendar(calendar: ICalendar): Observable<ICalendar> {
    return this.apollo.mutate<{updateCalendar: ICalendar}, ICalendar>({
      mutation: gql`
        mutation($_id: ID! $name: String $span: Int $day_begin: Int $day_len: Int $week_days: [Int]) {
          updateCalendar(_id: $_id name: $name span: $span
            day_begin: $day_begin day_len: $day_len week_days: $week_days ) { _id name span day_begin day_len week_days }
        }
      `,
      variables: {
        ...calendar
      }
    }).pipe(tap(r => console.log('CalendarService.updateCalendar res=', r)),  map(res => res.data.updateCalendar));
  }

  createCalendar(calendar: ICalendar): Observable<ICalendar> {
    return this.apollo.mutate<{createCalendar: ICalendar}, ICalendar>({
      mutation: gql`
        mutation($name: String! $span: Int! $day_begin: Int! $day_len: Int! $week_days: [Int]!) {
          createCalendar(name: $name span: $span
            day_begin: $day_begin day_len: $day_len week_days: $week_days ) { _id name span day_begin day_len week_days }
        }
      `,
      variables: {
        ...calendar
      }
    }).pipe(tap(r => console.log('CalendarService.createCalendar res=', r)),  map(res => res.data.createCalendar));
  }

  createOpeningHourTemplate(oht: IOpeningHoursTemplate): Observable<IOpeningHoursTemplate> {
    return this.apollo.mutate<{createOpeningHoursTemplate: IOpeningHoursTemplate}, IOpeningHoursTemplate>({
      mutation: gql`
        mutation($calendar_id: ID! $week_day: Int! $begin: Int! $len: Int! ) {
          createOpeningHoursTemplate(calendar_id:$calendar_id week_day:$week_day begin:$begin len:$len) {
            _id calendar_id week_day begin len
          }
        }
      `,
      variables: {
        ...oht
      }
    }).pipe(tap(r => console.log('CalendarService.createOpeningHoursTemplate res=', r)),  map(res => res.data.createOpeningHoursTemplate));
  }

  deleteOpeningHourTemplate(_id: string): Observable<IDeleteResponse> {
    return this.apollo.mutate<{deleteOpeningHoursTemplate: IDeleteResponse}, {_id: string}>({
      mutation: gql`
        mutation($_id: ID!) {
          deleteOpeningHoursTemplate(_id: $_id) {
            ok
            _id
          }
        }
      `,
      variables: {
        _id
      }
    }).pipe(tap(r => console.log('CalendarService.deleteOpeningHourTemplate res=', r)),  map(res => res.data.deleteOpeningHoursTemplate));
  }

  getOpeningHoursTemplates(): Observable<IOpeningHoursTemplate[]> {
    console.log('CalendarService.getOpeningHoursTemplates');
    return this.apollo.query<{openingHoursTemplates: IOpeningHoursTemplate[]}>({
      query: gql`{ openingHoursTemplates { _id calendar_id week_day begin len }}`,
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.openingHoursTemplates));
  }

  getCalendarWithOpeningHoursTemplate(_id: string): Observable<ICalendarWithOpeningHoursTemplates> {
    console.log('CalendarService.getCalendarWithOpeningHoursTemplate');
    return this.apollo.query<{calendar: ICalendar, templates: IOpeningHoursTemplate[]}, {calendar_id: string}>({
      query: gql`query($calendar_id:ID!) {
        calendar(_id:$calendar_id) {
          _id name span day_begin day_len week_days
        }
        templates: calendarOpeningHoursTemplates(calendar_id:$calendar_id) {
          _id
          calendar_id week_day begin len
        }
      }`,
      variables: {
        calendar_id: _id
      }
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data));
  }

  getCalendarWithEventTypes(_id: string): Observable<ICalendarWithEventTypes> {
    console.log('CalendarService.getCalendarWithEventTypes');
    return this.apollo.query<{calendar: ICalendar, event_types: ICalendarEventType[]}, {calendar_id: string}>({
      query: gql`query($calendar_id:ID!) {
        calendar(_id:$calendar_id) {
          _id name span day_begin day_len week_days
        }
        event_types: calendarEventTypes(calendar_id:$calendar_id) {
          _id
          calendar_id name color len order
        }
      }`,
      variables: {
        calendar_id: _id
      }
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data));
  }
  getCalendarWithEventType(calendar_id: string, calendar_event_type_id: string): Observable<ICalendarWithEventType> {
    return this.getCalendarWithEventTypes(calendar_id).pipe(map(r => {
      return { calendar: r.calendar, event_type: R.find<ICalendarEventType>(R.propEq('_id', calendar_event_type_id), r.event_types)};
    }));
  }

  getCalendarWithOpeningHours(_id: string, start_date: Date, end_date: Date): Observable<ICalendarWithOpeningHours> {
    console.log('CalendarService.getCalendarWithOpeningHours');
    return this.apollo.query<{calendar: ICalendar, ohs: IOpeningHours[]}, {calendar_id: string, start_date: string, end_date: string}>({
      query: gql`query($calendar_id:ID!, $start_date: Date!, $end_date: Date!) {
        calendar(_id:$calendar_id) {
          _id name span day_begin day_len week_days
        }
        ohs: calendarOpeningHours(calendar_id:$calendar_id, start_date:$start_date, end_date:$end_date) {
          _id
          calendar_id day begin len
        }
      }`,
      variables: {
        calendar_id: _id,
        start_date: M(start_date).format('YYYY-MM-DD'),
        end_date: M(end_date).format('YYYY-MM-DD'),
      }
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data));
  }

  createOpeningHours(oh: IOpeningHours): Observable<IOpeningHours> {
    return this.apollo.mutate<{createOpeningHours: IOpeningHours}, IOpeningHoursV>({
      mutation: gql`
        mutation($calendar_id: ID! $day_as_string: Date! $begin: Int! $len: Int! ) {
          createOpeningHours(calendar_id:$calendar_id day:$day_as_string begin:$begin len:$len) {
            _id calendar_id day begin len
          }
        }
      `,
      variables: {
        ...oh,
        day_as_string: M(oh.day).format('YYYY-MM-DD')
      }
    }).pipe(tap(r => console.log('CalendarService.createOpeningHour res=', r)),  map(res => res.data.createOpeningHours));
  }

  deleteOpeningHours(_id: string): Observable<IDeleteResponse> {
    return this.apollo.mutate<{deleteOpeningHours: IDeleteResponse}, {_id: string}>({
      mutation: gql`
        mutation($_id: ID!) {
          deleteOpeningHours(_id: $_id) {
            ok
            _id
          }
        }
      `,
      variables: {
        _id
      }
    }).pipe(tap(r => console.log('CalendarService.deleteOpeningHours res=', r)),  map(res => res.data.deleteOpeningHours));
  }

  updateEventType(event_type: ICalendarEventType): Observable<ICalendarEventType> {
    return this.apollo.mutate<{ updateCalendarEventType: ICalendarEventType}, ICalendarEventType>({
      mutation: gql`
        mutation($_id: ID! $name: String $color: String $len: Int $order: Int) {
          updateCalendarEventType(_id: $_id name: $name color: $color
            len: $len order: $order) {
              _id calendar_id name color len order
            }
        }
      `,
      variables: {
        ...event_type
      }
    }).pipe(tap(r => console.log('CalendarService.updateEventType res=', r)),  map(res => res.data.updateCalendarEventType));
  }

  createEventType(event_type: ICalendarEventType): Observable<ICalendarEventType> {
    return this.apollo.mutate<{createCalendarEventType: ICalendarEventType}, ICalendarEventType>({
      mutation: gql`
        mutation($calendar_id: ID! $name: String! $color: String! $len: Int! $order: Int!) {
          createCalendarEventType(calendar_id: $calendar_id name: $name color: $color
            len: $len order: $order  ) {
              _id calendar_id name color len order
            }
        }
      `,
      variables: {
        ...event_type
      }
    }).pipe(tap(r => console.log('CalendarService.createEventType res=', r)),  map(res => res.data.createCalendarEventType));
  }

  deleteEventType(_id: string): Observable<IDeleteResponse> {
    return this.apollo.mutate<{ deleteCalendarEventType: IDeleteResponse}, {_id: string}>({
      mutation: gql`
        mutation($_id: ID!) {
          deleteCalendarEventType(_id: $_id) {
            ok
            _id
          }
        }
      `,
      variables: {
        _id
      }
    }).pipe(tap(r => console.log('CalendarService.deleteEventType res=', r)),  map(res => res.data.deleteCalendarEventType));
  }

  getCalendarsStatus_(calendar_ids: string[], start_date: Date, end_date: Date): Observable<ICalendarStatusR[]> {
    return this.apollo.query<{calendarStatusDaysMulti: ICalendarStatusR[]},
     {calendar_ids: string[], start_date: string, end_date: string}>({
      query: gql`query($calendar_ids: [ID]! $start_date: Date! $end_date: Date!) {
            calendarStatusDaysMulti(calendar_ids:$calendar_ids start_date:$start_date end_date: $end_date) {
              calendar_id days { day any_ohs }
            }
        }`,
      variables: {
        calendar_ids,
        start_date: M(start_date).format('YYYY-MM-DD'),
        end_date: M(end_date).format('YYYY-MM-DD'),
      }
    }).pipe(tap(res => console.log('apollo res', res)), map(res => res.data.calendarStatusDaysMulti));
  }
  getCalendarsStatus(start_date: Date, end_date: Date): Observable<ICalendarStatus[]> {


    return this.getCalendars().pipe( /* delay(3000), */
      switchMap<ICalendar[], ICalendarStatusR[], ICalendarStatus[]>(
        (cals) => this.getCalendarsStatus_(cals.map(c => c._id), start_date, end_date),
        (cals , o) => o.map(cs => ({ calendar: R.find((c) => c._id === cs.calendar_id, cals) , days: cs.days}))
      ), tap(x => console.log('tap:', x)));


/*
      switchMap<ICalendar[], ICalendarStatusR[]>(
        (cals) => this.getCalendarsStatus_(cals.map(c => c._id), start_date, end_date),
    //  (i, o) => o.map(cs => ({ calendar: R.find(R.propEq('_id', cs.calendar_id), i), days: cs.days }))
      ),
      tap(x => console.log('tap:', x)));
    return of([]);
    */
  }
  convertStatuses2Grid(cals: ICalendarStatus[]): ICalendarGridInfo {
    const calendars: ICalendar[] = R.map<ICalendarStatus, ICalendar>(R.prop('calendar'), cals);

    const day_dates: string[] = R.uniq(R.flatten(R.map<ICalendarStatus, string[]>(cal => {
      const all =  R.map((d) => ({ day: d.day, show: d.any_ohs || R.contains(M(d.day).day(), cal.calendar.week_days)}), cal.days);
      return R.map(R.prop('day'), R.filter(R.propEq('show', true), all));
    }, cals))).sort();

    const x = R.map<string, ICalendarsStatusRow>((d) => ({
      day: M(d).toDate(),
      statuses: R.map<ICalendarStatus, ICalendarDayStatusE>((v) => {
          const cc = R.find(cd => (M(cd.day).isSame(d, 'day')) , v.days);
          return { ...cc, calendar_id: v.calendar._id};
      } , cals)
    }), day_dates);

    return {calendars, days: x };
  }
}
