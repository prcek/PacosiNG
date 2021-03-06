import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as M from 'moment';
import * as R from 'ramda';
import { ILocation } from './location.service';
import { CLR_LOGO } from './pdf/pdf_data';
import { formatDate2String_S } from './utils';

export interface ICalendar {
  _id: string;
  archived: boolean;
  location_id: string;
  name: string;
  span: number;
  cluster_len: number;
  day_begin: number;
  day_len: number;
  day_offset: number;
  week_days: number[];
  print_info: string;
}

export interface ICalendarEventType {
  _id: string;
  calendar_id: string;
  match_key: string;
  name: string;
  color: string;
  len: number;
  short_len: number;
  order: number;
}

export interface ICalendarEventClient {
    last_name: string;
    first_name: string;
    year: number;
    phone: string;
}
export interface ICalendarEvent {
  _id: string;
  calendar_id: string;
  event_type_id: string;
  event_name: string;
  client: ICalendarEventClient;
  comment: string;
  color: string;
  day: Date;
  begin: number;
  len: number;
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

export interface ICalendarWithEvents {
  calendar: ICalendar;
  events: ICalendarEvent[];
  event_types: ICalendarEventType[];
  ohs: IOpeningHours[];
  slots: ICalendarDaySlot[];
}

export interface ICalendarWithEvent extends ICalendarWithEvents {
  event: ICalendarEvent;
}


export interface ICalendarDaySlot {
  slot: number;
  empty: boolean;
  event: ICalendarEvent | null;
  event_leg: number | null;
  event_s_leg: boolean;
  normal_slot: boolean;
  extra_slot: boolean;
  cluster_idx: number;
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
  any_free: boolean;
  any_extra_free: boolean;
  any_event: boolean;
  any_extra: boolean;
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
  weeks: ICalendarsStatusRow[][];
}

export interface IClipBoardRecord {
  cutMode: boolean;
  event: ICalendarEvent;
  calendar: ICalendar;
}

/*
const CALENDARS: ICalendar[] = [
  { id: '1', name: 'jedna', span: 15},
  { id: '2', name: 'dva', span: 10},
  { id: '3', name: 'tri', span: 30}
];
*/


const ALL_CALENDAR_ATTRS = `
  _id
  archived
  location_id
  name span cluster_len
  day_begin
  day_len
  day_offset
  week_days
  print_info
`;

const ALL_CALENDAR_EVENT_ATTRS = `
  _id
  calendar_id
  event_type_id
  event_name
  day
  begin
  len
  client {
    last_name
    first_name
    year
    phone
  }
  comment
  color
`;

const ALL_CALENDAR_EVENT_TYPE_ATTRS = `
  _id
  calendar_id
  name
  match_key
  color
  len
  short_len
  order
`;

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private eventClipboardValue: IClipBoardRecord;
  private eventClipboardSubject = new Subject<IClipBoardRecord>();
  eventClipboard$ = this.eventClipboardSubject.asObservable();
  constructor(private apollo: Apollo) {
  }
  getCalendars(all: boolean = false): Observable<ICalendar[]> {
    // console.log('CalendarService.getCalendars', {all});
    return this.apollo.query<{calendars: ICalendar[]}>({
      query: gql`query($all:Boolean) { calendars(all:$all) { ${ALL_CALENDAR_ATTRS} }}`,
      variables: {all},
    }).pipe( /*tap(res => console.log('apollo res', res)),*/ map(res => res.data.calendars));
  }

  getCalendarsByIds(ids: string[]): Observable<ICalendar[]> {
    // console.log('CalendarService.getCalendars', {all});
    return this.apollo.query<{calendars: ICalendar[]}>({
      query: gql`query($ids:[ID]!) { calendars(ids: $ids) { ${ALL_CALENDAR_ATTRS} }}`,
      variables: {ids},
    }).pipe( /*tap(res => console.log('apollo res', res)),*/ map(res => res.data.calendars));
  }

  getCalendar(_id: string): Observable<ICalendar> {
    return this.apollo.query<{calendar: ICalendar}>({
      query: gql`query($_id:ID!) { calendar(_id:$_id) { ${ALL_CALENDAR_ATTRS} }}`,
      variables: {_id},
    }).pipe( /* tap(res => console.log('apollo res', res)),*/ map(res => res.data.calendar));
  }

  watchCalendar(_id: string): Observable<ICalendar> {
    return this.apollo.watchQuery<{calendar: ICalendar}>({
      query: gql`query($_id:ID!) { calendar(_id:$_id) { ${ALL_CALENDAR_ATTRS} }}`,
      variables: {_id},
    }).valueChanges.pipe(map(res => res.data.calendar));
  }


  updateCalendar(calendar: ICalendar): Observable<ICalendar> {
    return this.apollo.mutate<{updateCalendar: ICalendar}, ICalendar>({
      mutation: gql`
        mutation($_id: ID! $archived: Boolean $location_id: ID $name: String $span: Int $cluster_len: Int
          $day_begin: Int $day_len: Int $day_offset: Int $week_days: [Int], $print_info: String) {
          updateCalendar(_id: $_id name: $name location_id: $location_id archived: $archived span: $span cluster_len: $cluster_len
            day_begin: $day_begin day_len: $day_len day_offset: $day_offset week_days: $week_days print_info: $print_info )
            { ${ALL_CALENDAR_ATTRS} }
        }
      `,
      variables: {
        ...calendar
      }
    }).pipe( /*tap(r => console.log('CalendarService.updateCalendar res=', r)),*/  map(res => res.data.updateCalendar));
  }

  createCalendar(calendar: ICalendar): Observable<ICalendar> {
    return this.apollo.mutate<{createCalendar: ICalendar}, ICalendar>({
      mutation: gql`
        mutation($name: String! $location_id: ID! $span: Int! $cluster_len: Int! $day_begin: Int!
          $day_len: Int! $day_offset: Int! $week_days: [Int]!,
        $print_info: String!) {
          createCalendar(name: $name  location_id: $location_id span: $span cluster_len: $cluster_len
            day_begin: $day_begin day_len: $day_len day_offset: $day_offset week_days: $week_days print_info: $print_info)
            { ${ALL_CALENDAR_ATTRS} }
        }
      `,
      variables: {
        ...calendar
      }
    }).pipe( /* tap(r => console.log('CalendarService.createCalendar res=', r)),*/ map(res => res.data.createCalendar));
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
    }).pipe(
      /* tap(r => console.log('CalendarService.createOpeningHoursTemplate res=', r)),*/
      map(res => res.data.createOpeningHoursTemplate)
      );
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
    }).pipe(
      // tap(r => console.log('CalendarService.deleteOpeningHourTemplate res=', r)),
      map(res => res.data.deleteOpeningHoursTemplate)
    );
  }

  getOpeningHoursTemplates(): Observable<IOpeningHoursTemplate[]> {
    console.log('CalendarService.getOpeningHoursTemplates');
    return this.apollo.query<{openingHoursTemplates: IOpeningHoursTemplate[]}>({
      query: gql`{ openingHoursTemplates { _id calendar_id week_day begin len }}`,
    }).pipe(
      // tap(res => console.log('apollo res', res)),
      map(res => res.data.openingHoursTemplates)
    );
  }

  getCalendarWithOpeningHoursTemplate(_id: string): Observable<ICalendarWithOpeningHoursTemplates> {
    // console.log('CalendarService.getCalendarWithOpeningHoursTemplate');
    return this.apollo.query<{calendar: ICalendar, templates: IOpeningHoursTemplate[]}, {calendar_id: string}>({
      query: gql`query($calendar_id:ID!) {
        calendar(_id:$calendar_id) {
          ${ALL_CALENDAR_ATTRS}
        }
        templates: calendarOpeningHoursTemplates(calendar_id:$calendar_id) {
          _id
          calendar_id week_day begin len
        }
      }`,
      variables: {
        calendar_id: _id
      }
    }).pipe(
      // tap(res => console.log('apollo res', res)),
      map(res => res.data)
    );
  }

  getCalendarWithEventTypes(_id: string): Observable<ICalendarWithEventTypes> {
    // console.log('CalendarService.getCalendarWithEventTypes');
    return this.apollo.query<{calendar: ICalendar, event_types: ICalendarEventType[]}, {calendar_id: string}>({
      query: gql`query($calendar_id:ID!) {
        calendar(_id:$calendar_id) {
          ${ALL_CALENDAR_ATTRS}
        }
        event_types: calendarEventTypes(calendar_id:$calendar_id) {
          ${ALL_CALENDAR_EVENT_TYPE_ATTRS}
        }
      }`,
      variables: {
        calendar_id: _id
      }
    }).pipe(
     // tap(res => console.log('apollo res', res)),
      map(res => res.data)
    );
  }
  getCalendarWithEventType(calendar_id: string, calendar_event_type_id: string): Observable<ICalendarWithEventType> {
    return this.getCalendarWithEventTypes(calendar_id).pipe(map(r => {
      return { calendar: r.calendar, event_type: R.find<ICalendarEventType>(R.propEq('_id', calendar_event_type_id), r.event_types)};
    }));
  }

  getCalendarWithOpeningHours(_id: string, start_date: Date, end_date: Date): Observable<ICalendarWithOpeningHours> {
    // console.log('CalendarService.getCalendarWithOpeningHours');
    return this.apollo.query<{calendar: ICalendar, ohs: IOpeningHours[]}, {calendar_id: string, start_date: string, end_date: string}>({
      query: gql`query($calendar_id:ID!, $start_date: Date!, $end_date: Date!) {
        calendar(_id:$calendar_id) {
          ${ALL_CALENDAR_ATTRS}
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
    }).pipe( /* tap(res => console.log('apollo res', res)),*/ map(res => res.data));
  }

  // tslint:disable-next-line:max-line-length
  _convertEvents2List(calendar: ICalendar, event_types: ICalendarEventType[],  events: ICalendarEvent[], ohs: IOpeningHours[]): ICalendarDaySlot[] {

    const a = R.flatten(R.map<ICalendarEvent, number[]>(e => R.range(e.begin, e.begin + e.len), events)).sort();
    const b = R.flatten(R.map<IOpeningHours, number[]>(e => R.range(e.begin, e.begin + e.len), ohs)).sort();
    const c = R.uniq(R.flatten([a, b])).sort();

    const lookup_event = (e: ICalendarEvent, s: number) => {
      if (e.begin === s) {
        return true;
      } else if ((e.begin < s) && (e.begin + e.len > s)) {
        return true;
      }
      return false;
    };


    const slots = R.map<number, ICalendarDaySlot>(n => {
      const ce = R.find<ICalendarEvent>(e => lookup_event(e, n), events);
      let event_s_leg = false;
      if (ce) {
        const et = R.find<ICalendarEventType>(R.propEq('_id', ce.event_type_id), event_types);
        if (et) {
          const short_len  = et.short_len;
          const c_len = n - ce.begin;
          if ((c_len + 1 ) > short_len) {  //  +1 ?>?>  mozna jen >= ?
            event_s_leg = true;
          }
          // console.log('_convertEvents2List -  et', ce, et, short_len, c_len);
        } else {
          // console.log('_convertEvents2List -  nenalezeny et', ce);
        }
      }

      const  cluster_idx = (n % calendar.cluster_len);
      const event_leg = (ce ) ? n - ce.begin : undefined;

      return {
        slot: n,
        normal_slot: (((!!ce) && event_leg === 0) || (cluster_idx === 0 && !ce)),
        extra_slot: ((cluster_idx && (!ce)) || (cluster_idx && event_s_leg)),
        cluster_idx,
        event: ce,
        event_leg,
        event_s_leg: event_s_leg,
        empty: !(ce)
      };
    }, c);
    return slots;
  }

  getCalendarWithEvents(_id: string, day: Date): Observable<ICalendarWithEvents> {
    const start_date = M(day).utc().startOf('day').format('YYYY-MM-DD');
    const end_date = M(day).utc().startOf('day').add(1, 'day').format('YYYY-MM-DD');
    // console.log('CalendarService.getCalendarWithEvents', day, start_date, end_date);
    // tslint:disable-next-line:max-line-length
    return this.apollo.query<{calendar: ICalendar, ohs: IOpeningHours[], events: ICalendarEvent[], event_types: ICalendarEventType[]}, {calendar_id: string, start_date: string, end_date: string}>({
      query: gql`query($calendar_id:ID!, $start_date: Date!, $end_date: Date!) {
        calendar(_id:$calendar_id) {
          ${ALL_CALENDAR_ATTRS}
        }
        events: calendarEvents(calendar_id:$calendar_id, start_date:$start_date, end_date:$end_date) {
          ${ALL_CALENDAR_EVENT_ATTRS}
        }
        ohs: calendarOpeningHours(calendar_id:$calendar_id, start_date:$start_date, end_date:$end_date) {
          _id
          calendar_id day begin len
        }
        event_types: calendarEventTypes(calendar_id:$calendar_id) {
          ${ALL_CALENDAR_EVENT_TYPE_ATTRS}
        }
      }`,
      variables: {
        calendar_id: _id,
        start_date,
        end_date
      }
    // tslint:disable-next-line:max-line-length
    }).pipe(  // tap(res => console.log('apollo res', res)),
        map(res => {
          return {
            calendar: res.data.calendar,
            events: res.data.events,
            event_types: res.data.event_types,
            ohs: res.data.ohs,
            slots: this._convertEvents2List(res.data.calendar, res.data.event_types, res.data.events, res.data.ohs)
          };
        }));
  }

  getCalendarWithEvent(calendar_id: string, day: Date, calendar_event_id: string): Observable<ICalendarWithEvent> {
    return this.getCalendarWithEvents(calendar_id, day).pipe(map(r => {
      return { ...r, event: R.find<ICalendarEvent>(R.propEq('_id', calendar_event_id), r.events)};
    }));
  }

  getCalendarEvent(_id: string): Observable<ICalendarEvent> {
    return this.apollo.query<{calendarEvent: ICalendarEvent}>({
      query: gql`query($_id:ID!) { calendarEvent(_id:$_id) { ${ALL_CALENDAR_EVENT_ATTRS} }}`,
      variables: {_id},
    }).pipe( /* tap(res => console.log('apollo res', res)),*/ map(res => res.data.calendarEvent));
  }

  watchCalendarEvent(_id: string): Observable<ICalendarEvent> {
    return this.apollo.watchQuery<{calendarEvent: ICalendarEvent}>({
      query: gql`query($_id:ID!) { calendarEvent(_id:$_id) { ${ALL_CALENDAR_EVENT_ATTRS} }}`,
      variables: {_id},
    }).valueChanges.pipe(map(res => res.data.calendarEvent));
  }


  planOpeningHours(calendar_id: string, start_day: Date, end_day: Date): Observable<IOpeningHours[]> {
    return this.apollo.mutate<{planOpeningHours: IOpeningHours[]}, {calendar_id: string, start_day: string, end_day: string}>({
      mutation: gql`
        mutation($calendar_id: ID! $start_day: Date! $end_day: Date! ) {
            planOpeningHours(calendar_id:$calendar_id start_day:$start_day end_day:$end_day) {
            _id calendar_id day begin len
          }
        }
      `,
      variables: {
        calendar_id,
        start_day: M(start_day).utc().format('YYYY-MM-DD'),
        end_day: M(end_day).utc().format('YYYY-MM-DD')
      }
    }).pipe(
      tap(r => console.log('CalendarService.planOpeningHours res=', r)),
      map(res => res.data.planOpeningHours)
    );
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
    }).pipe(
      // tap(r => console.log('CalendarService.createOpeningHour res=', r)),
      map(res => res.data.createOpeningHours)
    );
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
    }).pipe(
      // tap(r => console.log('CalendarService.deleteOpeningHours res=', r)),
      map(res => res.data.deleteOpeningHours)
    );
  }

  updateEventType(event_type: ICalendarEventType): Observable<ICalendarEventType> {
    return this.apollo.mutate<{ updateCalendarEventType: ICalendarEventType}, ICalendarEventType>({
      mutation: gql`
        mutation($_id: ID! $name: String $match_key: String $color: String $len: Int $short_len: Int $order: Int) {
          updateCalendarEventType(_id: $_id name: $name  match_key: $match_key color: $color
            len: $len short_len: $short_len order: $order) {
              ${ALL_CALENDAR_EVENT_TYPE_ATTRS}
            }
        }
      `,
      variables: {
        ...event_type
      }
    }).pipe(
      // tap(r => console.log('CalendarService.updateEventType res=', r)),
      map(res => res.data.updateCalendarEventType)
    );
  }

  createEventType(event_type: ICalendarEventType): Observable<ICalendarEventType> {
    return this.apollo.mutate<{createCalendarEventType: ICalendarEventType}, ICalendarEventType>({
      mutation: gql`
        mutation($calendar_id: ID! $name: String! $match_key: String! $color: String! $len: Int! $short_len: Int! $order: Int!) {
          createCalendarEventType(calendar_id: $calendar_id name: $name match_key: $match_key color: $color
            len: $len short_len: $short_len order: $order  ) {
              ${ALL_CALENDAR_EVENT_TYPE_ATTRS}
            }
        }
      `,
      variables: {
        ...event_type
      }
    }).pipe(
      // tap(r => console.log('CalendarService.createEventType res=', r)),
      map(res => res.data.createCalendarEventType)
    );
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
    }).pipe(
      // tap(r => console.log('CalendarService.deleteEventType res=', r)),
      map(res => res.data.deleteCalendarEventType)
    );
  }



  updateEvent(event: ICalendarEvent, extra_mode: boolean): Observable<ICalendarEvent> {
    return this.apollo.mutate<{ updateCalendarEvent: ICalendarEvent}, ICalendarEvent | { extra_mode: boolean }>({
      mutation: gql`
        mutation($_id: ID! $client: CalendarEventClientInput! $event_type_id: ID!  $day: Date! $begin: Int! $comment: String!
        $extra_mode: Boolean) {
          updateCalendarEvent(_id: $_id client: $client event_type_id: $event_type_id day: $day begin: $begin comment: $comment
          extra_mode: $extra_mode) {
              ${ALL_CALENDAR_EVENT_ATTRS}
            }
        }
      `,
      variables: {
        ...event,
        extra_mode
      }
    }).pipe(
      // tap(r => console.log('CalendarService.updateEvent res=', r)),
      map(res => res.data.updateCalendarEvent)
    );
  }

  createEvent(event: ICalendarEvent, extra_mode: boolean = false): Observable<ICalendarEvent> {
    return this.apollo.mutate<{createCalendarEvent: ICalendarEvent}, ICalendarEvent | {extra_mode: boolean}>({
      mutation: gql`
        mutation($calendar_id: ID! $client: CalendarEventClientInput! $event_type_id: ID!  $day: Date! $begin: Int! $comment: String!
        $extra_mode: Boolean) {
          createCalendarEvent(calendar_id: $calendar_id client: $client
            event_type_id: $event_type_id day: $day begin: $begin comment: $comment, extra_mode: $extra_mode) {
              ${ALL_CALENDAR_EVENT_ATTRS}
            }
        }
      `,
      variables: {
        ...event,
        extra_mode
      }
    }).pipe(
      // tap(r => console.log('CalendarService.createEvent res=', r)),
      map(res => res.data.createCalendarEvent)
    );
  }

  deleteEvent(_id: string): Observable<IDeleteResponse> {
    return this.apollo.mutate<{ deleteCalendarEvent: IDeleteResponse}, {_id: string}>({
      mutation: gql`
        mutation($_id: ID!) {
          deleteCalendarEvent(_id: $_id) {
            ok
            _id
          }
        }
      `,
      variables: {
        _id
      }
    }).pipe(
      // tap(r => console.log('CalendarService.deleteEvent res=', r)),
      map(res => res.data.deleteCalendarEvent)
    );
  }
  searchCalendarEvents(search: string, calendar_ids: string[], start_date: Date, end_date: Date): Observable<ICalendarEvent[]> {
        // tslint:disable-next-line:max-line-length
        return this.apollo.query<{calendarEventSearch: ICalendarEvent[]}, {search: string, calendar_ids: string[], start_date: string, end_date: string}>({
          query: gql`query($search: String! $calendar_ids: [ID]! $start_date: Date! $end_date: Date!) {
                calendarEventSearch(search:$search calendar_ids:$calendar_ids start_date:$start_date end_date: $end_date) {
                  ${ALL_CALENDAR_EVENT_ATTRS}
                }
            }`,
          variables: {
            search,
            calendar_ids,
            start_date: M(start_date).format('YYYY-MM-DD'),
            end_date: M(end_date).format('YYYY-MM-DD'),
          }
        }).pipe(
          // tap(res => console.log('apollo res', res)),
          map(res => res.data.calendarEventSearch)
        );

  }

  getCalendarsStatus_(calendar_ids: string[], start_date: Date, end_date: Date): Observable<ICalendarStatusR[]> {
    // tslint:disable-next-line:max-line-length
    return this.apollo.query<{calendarStatusDaysMulti: ICalendarStatusR[]}, {calendar_ids: string[], start_date: string, end_date: string}>({
      query: gql`query($calendar_ids: [ID]! $start_date: Date! $end_date: Date!) {
            calendarStatusDaysMulti(calendar_ids:$calendar_ids start_date:$start_date end_date: $end_date) {
              calendar_id days { day any_ohs any_free any_extra_free any_event any_extra}
            }
        }`,
      variables: {
        calendar_ids,
        start_date: M(start_date).format('YYYY-MM-DD'),
        end_date: M(end_date).format('YYYY-MM-DD'),
      }
    }).pipe(
      // tap(res => console.log('apollo res', res)),
      map(res => res.data.calendarStatusDaysMulti)
    );
  }
  getAllCalendarsStatus(start_date: Date, end_date: Date): Observable<ICalendarStatus[]> {


    return this.getCalendars().pipe( /* delay(3000), */
      switchMap<ICalendar[], ICalendarStatusR[], ICalendarStatus[]>(
        (cals) => this.getCalendarsStatus_(cals.map(c => c._id), start_date, end_date),
        (cals , o) => o.map(cs => ({ calendar: R.find((c) => c._id === cs.calendar_id, cals) , days: cs.days}))
    ) /*, tap(x => console.log('tap:', x)) */);

  }

  getCalendarsStatus(cal_ids: string[] | null, start_date: Date, end_date: Date): Observable<ICalendarStatus[]> {
    if (cal_ids == null) {
      return this.getAllCalendarsStatus(start_date, end_date);
    }

    return this.getCalendarsByIds(cal_ids).pipe( /* delay(3000), */
      switchMap<ICalendar[], ICalendarStatusR[], ICalendarStatus[]>(
        (cals) => this.getCalendarsStatus_(cals.map(c => c._id), start_date, end_date),
        (cals , o) => o.map(cs => ({ calendar: R.find((c) => c._id === cs.calendar_id, cals) , days: cs.days}))
    ) /*, tap(x => console.log('tap:', x)) */);

  }

  convertStatuses2Grid(cals: ICalendarStatus[]): ICalendarGridInfo {
    const calendars: ICalendar[] = R.map<ICalendarStatus, ICalendar>(R.prop('calendar'), cals);
    const day_dates: string[] = R.uniq(R.flatten(R.map<ICalendarStatus, string[]>(cal => {
      // tslint:disable-next-line:max-line-length
      const all =  R.map((d) => ({ day: d.day, show: d.any_ohs || d.any_event || R.contains(M(d.day).day(), cal.calendar.week_days)}), cal.days);
      return R.map(R.prop('day'), R.filter(R.propEq('show', true), all));
    }, cals))).sort();
   // console.log('day_dates', day_dates);
    const x = R.map<string, ICalendarsStatusRow>((d) => ({
      day: M.utc(d).toDate(),
      statuses: R.map<ICalendarStatus, ICalendarDayStatusE>((v) => {
          const cc = R.find(cd => (M(cd.day).isSame(d, 'day')) , v.days);
          return { ...cc, calendar_id: v.calendar._id};
      } , cals)
    }), day_dates);


    // const yow = (val: ICalendarsStatusRow[], key: string) => (val);
    const y = R.groupBy<ICalendarsStatusRow>( (r) => M(r.day).utc().startOf('isoWeek').format('YYYY-MM-DD'), x);
    const weeks = R.values(y);
    // console.log('WEEKS', weeks);

    return {calendars, days: x , weeks };
  }

  event2timestring(cal: ICalendar,  e: ICalendarEvent) {
    const t = cal.span * (e.begin) + cal.day_offset;
    const m = t % 60;
    const h =  (t - m) / 60;
    const Ho = h.toString().padStart(2, '0');
    const Mi = m.toString().padStart(2, '0');
    return Ho + ':' + Mi;
  }

  event2pdf(calendar: ICalendar,  event: ICalendarEvent): Observable<object> {
    return this.apollo.query<{location: ILocation}>({
      query: gql`query($_id:ID!) { location(_id:$_id) { _id archived name address }}`,
      variables: {_id: calendar.location_id},
    }).pipe(map(res => res.data.location), map(location => {

      const ds = formatDate2String_S(event.day);
      const client = event.client.last_name + ' ' + event.client.first_name + (event.client.year ? (' (' + event.client.year + ')') : '') ;
      const etime = this.event2timestring(calendar, event);
      const DD = {
        content: [
          {
            image: CLR_LOGO,
            width: 200,
            margin: [0, 10, 0, 0],
          },
          {
            text: client,
            style: 'header',
            margin: [0, 10, 0, 0],
          },
          {
            table: {
              widths: ['auto', '*'],
              body: [
                ['Datum:', ds],
                ['Čas:', etime],
                ['Lékař:', calendar.name],
                ['Pobočka:', location.address],
              ]
            },
            layout: 'noBorders',
          },
          /*
          {
            text: 'Datum: ' + ds
          },
          {
            text: 'Čas: ' + etime
          },
          {
            text: 'Lékař: ' + calendar.name,
          },
          {
            text: 'Pobočka: ' + location.address,
          },
          */
          {
            text: calendar.print_info,
            margin: [0, 20, 0, 0],
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          quote: {
            italics: true
          },
          small: {
            fontSize: 8
          }
        },
        pageSize: 'A5'
      };
      return DD;
    }));
  }


  clipboardCopy(cal: ICalendar,  e: ICalendarEvent): void {
    this.eventClipboardValue = {
      cutMode: false,
      calendar: cal,
      event: e
    };
    this.eventClipboardSubject.next(this.eventClipboardValue);
  }

  clipboardCut(cal: ICalendar,  e: ICalendarEvent): void {
    this.eventClipboardValue = {
      cutMode: true,
      calendar: cal,
      event: e
    };
    this.eventClipboardSubject.next(this.eventClipboardValue);
  }

  clipboardClear(): void {
    this.eventClipboardValue = null;
    this.eventClipboardSubject.next(null);
  }
  clipboardValue(): IClipBoardRecord {
    return this.eventClipboardValue;
  }

}
