
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore } from './../store';
import {
    IContextBase,
    ICalendar,
    IOpeningHoursTemplate,
    IDeleteResponse,
    IDayOpeningHours,
    ICalendarEventType,
    ICalendarStatusDays,
} from './../types';

import * as R from 'ramda';
import * as M from 'moment';
import { of } from 'rxjs';


export class CalendarAPI implements DataSource {
    context: IContextBase;
    constructor(private store: IStore) {
        console.log('new CalendarAPI');
    }
    initialize(config: DataSourceConfig<IContextBase>) {
        this.context = config.context;
    }
    async getAllCalendars(): Promise<ICalendar[]> {
        return this.store.calendarModel.find({});
    }
    async getOneCalendar(_id: string): Promise<ICalendar> {
        return this.store.calendarModel.findById(_id);
    }
    async getAllOHTemplates(): Promise<IOpeningHoursTemplate[]> {
        return this.store.openingHoursTemplateModel.find({});
    }
    async getCalendarOHTemplates(calendar_id: string): Promise<IOpeningHoursTemplate[]> {
        return this.store.openingHoursTemplateModel.find({calendar_id: calendar_id});
    }
    async getCalendarOHs(calendar_id: string, start_date: Date, end_date: Date): Promise<IDayOpeningHours[]> {
        return this.store.dayOpeningHoursModel.find({
            calendar_id: calendar_id,
            day: { '$gte': start_date, '$lt': end_date }
        });
    }
    async createCalendar(name: string, span: number,
        day_begin: number, day_len: number, week_days: number[]): Promise<ICalendar> {
        return this.store.calendarModel.create({
            name,
            span,
            day_begin,
            day_len,
            week_days
        });
    }
    async updateCalendar(_id: string, name: string, span: number,
        day_begin: number, day_len: number, week_days: number[]): Promise<ICalendar> {
        const cal = await this.store.calendarModel.findById(_id);
        if (!cal) {
            throw new Error('Something bad happened');
        }
        cal.set({name, span, day_begin, day_len, week_days});
        return cal.save();
    }

    async createOHTemplate(calendar_id: string, week_day: number, begin: number, len: number): Promise<IOpeningHoursTemplate> {
        return this.store.openingHoursTemplateModel.create({
            calendar_id,
            week_day,
            begin,
            len
        });
    }

    async deleteOHTemplate(_id: string): Promise<IDeleteResponse> {
        const del = await this.store.openingHoursTemplateModel.findByIdAndRemove(_id);
        if (del) {
            return { ok: true, _id: del._id};
        }
        return {ok: false, _id: _id};
    }


    async createOH(calendar_id: string, day: Date, begin: number, len: number): Promise<IDayOpeningHours> {
        return this.store.dayOpeningHoursModel.create({
            calendar_id,
            day,
            begin,
            len
        });
    }

    async deleteOH(_id: string): Promise<IDeleteResponse> {
        const del = await this.store.dayOpeningHoursModel.findByIdAndRemove(_id);
        if (del) {
            return { ok: true, _id: del._id};
        }
        return {ok: false, _id: _id};
    }

    async getCalendarEventTypes(calendar_id: string): Promise<ICalendarEventType[]> {
        return this.store.calendarEventTypeModel.find({calendar_id: calendar_id});
    }
    async getCalendarStatusDays(calendar_id: string, start_date: Date, end_date: Date): Promise<ICalendarStatusDays> {
        const ohs = await this.store.dayOpeningHoursModel.find({
            calendar_id: calendar_id,
            day: { '$gte': start_date, '$lt': end_date }
        });
      //  console.log('getCalendarStatusDays - ohs=', ohs);

        const ohsGroups = R.groupBy<IDayOpeningHours>((i) => M(i.day).format('YYYY-MM-DD'), ohs);
        const days_count = M(end_date).diff(start_date, 'days');
        const days = R.range(0, days_count).map(i => M(start_date).add(i, 'day').format('YYYY-MM-DD'));
        const sdays = days.map(d => {
            return {day: M(d).toDate(), any_ohs: R.has(d, ohsGroups)};
        });
        return { calendar_id: calendar_id, days: sdays};
    }

    async createET(calendar_id: string, name: string, color: string, len: number, order: number): Promise<ICalendarEventType> {
        return this.store.calendarEventTypeModel.create({
            calendar_id,
            name,
            color,
            len,
            order
        });
    }

    async updateET(_id: string,  name: string, color: string, len: number, order: number): Promise<ICalendarEventType> {
        const cal = await this.store.calendarEventTypeModel.findById(_id);
        if (!cal) {
            throw new Error('Something bad happened');
        }
        cal.set({name, color, len, order});
        return cal.save();
    }

    async deleteET(_id: string): Promise<IDeleteResponse> {
        const del = await this.store.calendarEventTypeModel.findByIdAndRemove(_id);
        if (del) {
            return { ok: true, _id: del._id};
        }
        return {ok: false, _id: _id};
    }

}
