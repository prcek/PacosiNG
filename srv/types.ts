
export interface IUser {
    login: string;
    name: string;
    root: boolean;
    roles: string[];
    calendar_ids: string[];
}

export interface ICalendar {
    _id: any;
    archived: boolean;
    location_id: string;
    name: string;
    span: number;
    cluster_len: number;
    day_len: number;
    day_begin: number;
    day_offset: number;
    week_days: number[];
    print_info: string;
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
    short_len: number;
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
    shortable_len: number;
    full_len: number;
}

export interface ICalendarEventClient {
    first_name: string;
    last_name: string;
    title: string;
    phone: string;
    year: number;
}
export interface ICalendarEventClientND {
    first_name: string;
    last_name: string;
}

export interface ICalendarStatusDay {
    day: Date;
    any_ohs: boolean;
    any_free: boolean;
    any_extra_free: boolean;
    any_event: boolean;
    any_extra: boolean;
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
    request_id: string;
    user: IUser;
    global_counter: number;
    big: any;
}


