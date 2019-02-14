
export interface IUser {
    login: string;
    name: string;
    sudo: boolean;
    roles: string[];
}

export interface ICalendar {
    _id: any;
    name: string;
    span: number;
    day_len: number;
    day_begin: number;
    week_days: number[];
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
    name: string;
    color: string;
    len: number;
    order: number;
}

export interface ICalendarStatusDay {
    calendar_id: any;
    day: Date;
    ohs: boolean;
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


