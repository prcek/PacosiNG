
export interface IUser {
    login: string;
    name: string;
    sudo: boolean;
    roles: string[];
    calendar_ids: string[];
}

export interface ICalendar {
    _id: any;
    archived: boolean;
    name: string;
    span: number;
    day_len: number;
    day_begin: number;
    week_days: number[];
}

export interface ILocation {
    _id: any;
    archived: boolean;
    name: string;
    address: string;
}


export interface IOpeningHoursTemplate extends IOpeningHours {
    _id: any;
    week_day: number;
}

export interface IDayOpeningHours extends IOpeningHours {
    _id: any;
    day: Date;
}

export interface IOpeningHours {
    calendar_id: any;
    begin: number;
    len: number;
}

export interface ICalendarEventType {
    _id: any;
    calendar_id: any;
    match_key: string;
    name: string;
    color: string;
    len: number;
    order: number;
}

export interface ICalendarEvent {
    _id: any;
    calendar_id: any;
    event_type_id: any;
    event_name: string;
    client: ICalendarEventClient;
    color: string;
    day: Date;
    begin: number;
    len: number;
}

export interface ICalendarEventClient {
    first_name: string;
    last_name: string;
    title: string;
    phone: string;
    year: number;
}

export interface ICalendarStatusDay {
    day: Date;
    any_ohs: boolean;
    any_free: boolean;
    any_event: boolean;
}
export interface ICalendarStatusDays {
    calendar_id: any;
    days: ICalendarStatusDay[];
}


export interface IToken  {
    version: number;
    user: IUser;
}

export interface ILoginResponse {
    ok: boolean;
    token: string;
    user: IUser;
}
export interface IDeleteResponse {
    ok: boolean;
    _id: string;
}

export interface IContextBase {
    user: IUser;
    global_counter: number;
    big: any;
}


