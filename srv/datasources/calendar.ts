
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
    ICalendarEvent,
    ICalendarEventClient,
    ICalendarEventClientND,
} from './../types';
import { A_ds_log } from './../audit';

import * as R from 'ramda';
import * as M from 'moment';
import { of } from 'rxjs';
import { remove as removeDia } from 'diacritics';

function safe_remove_dia(s: string): string {
    if (s) {
        return removeDia(s).trim().toLowerCase();
    }
    return s;
}

function remove_client_dia(client: ICalendarEventClient): ICalendarEventClientND {
    return  {
        first_name: safe_remove_dia(client.first_name),
        last_name: safe_remove_dia(client.last_name)
    };
}


export class CalendarAPI implements DataSource {
    context: IContextBase;
    constructor(private store: IStore) {
        console.log('new CalendarAPI');
    }
    initialize(config: DataSourceConfig<IContextBase>) {
        this.context = config.context;
    }
    async getCalendars(all: boolean = false, ids: string[] = null): Promise<ICalendar[]> {
        const q = all ? {} : {archived: {$ne: true}};
        if (ids !== null) {
            console.log('getCalendars', ids);
            const q_ids = {_id: { $in: ids}, ...q};
            return this.store.calendarModel.find(q_ids);
        }
        return this.store.calendarModel.find(q);
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
        console.log('getCalendarOHs', M(start_date).toISOString(), M(end_date).toISOString());
        const ohs = await this.store.dayOpeningHoursModel.find({
            calendar_id: calendar_id,
            day: { '$gte': start_date, '$lt': end_date }
        });
        // console.log('X0', R.map(o => M(o.day).toISOString(), ohs));
        return ohs;
    }

    async getCalendarEvents(calendar_id: string, start_date: Date, end_date: Date): Promise<ICalendarEvent[]> {
        console.log('getCalendarEvents', M(start_date).toISOString(), M(end_date).toISOString());
        const events = await this.store.calendarEventModel.find({
            calendar_id: calendar_id,
            day: { '$gte': start_date, '$lt': end_date }
        });
        return events;
    }

    async _getCalendarDayEvents(calendar_id: string, day: Date): Promise<ICalendarEvent[]> {
        const sd = M.utc(day).startOf('day');
        const ed = M(sd).utc().add(1, 'day');
        return this.getCalendarEvents(calendar_id, sd.toDate(), ed.toDate());
    }


    async getCalendarEvent(_id: string): Promise<ICalendarEvent> {
        return this.store.calendarEventModel.findById(_id);
    }


    async createCalendar(location_id: string, name: string, span: number, cluster_len: number,
        day_begin: number, day_len: number, day_offset: number, week_days: number[], print_info: string): Promise<ICalendar> {
        return this.store.calendarModel.create({
            archived: false,
            location_id,
            name,
            span,
            cluster_len,
            day_begin,
            day_len,
            day_offset,
            week_days,
            print_info
        });
    }
    async updateCalendar(_id: string, archived: boolean, location_id: string, name: string, span: number, cluster_len: number,
        day_begin: number, day_len: number, day_offset: number, week_days: number[], print_info: string): Promise<ICalendar> {
        const cal = await this.store.calendarModel.findById(_id);
        if (!cal) {
            throw new Error('Something bad happened');
        }
        cal.set({archived, location_id, name, span, cluster_len, day_begin, day_len, day_offset, week_days, print_info});
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
        console.log('createOH', M(day).toISOString());
        return this.store.dayOpeningHoursModel.create({
            calendar_id,
            day,
            begin,
            len
        });
    }

    async planOH(calendar_id: string, start_day: Date, end_day: Date): Promise<IDayOpeningHours[]> {
        console.log('planOH', calendar_id, M(start_day).toISOString(), M(end_day).toISOString());

        const calendar = await this.store.calendarModel.findById(calendar_id);
        if (!calendar) {
            throw new Error('Something bad happened');
        }
        const templates = await this.store.openingHoursTemplateModel.find({calendar_id: calendar_id});
        if (!templates) {
            throw new Error('Something bad happened');
        }
        const templatesGroups = R.groupBy<IOpeningHoursTemplate>(R.prop('week_day'), templates);
        const day_count = M(end_day).utc().diff(start_day, 'days');

        if ((day_count < 1) || (day_count > 365)) {
            throw new Error('Something bad happened');
        }

        // console.log('day_count', day_count);
        const days = R.map( day => (M(start_day).utc().add(day, 'days')), R.range(0, day_count) );
        // console.log('days', days);

        const new_ohs = R.flatten(R.map<M.Moment, IDayOpeningHours[]>( m => {
            const week_day = m.weekday();
            if (R.has(week_day, templatesGroups)) {
                const templ = templatesGroups[week_day];
                // console.log('XXX:', m.toISOString(), week_day, templ);
                return R.map<IOpeningHoursTemplate, IDayOpeningHours>(t => ({
                    _id: null,
                    day: m.toDate(),
                    calendar_id: calendar_id,
                    begin: t.begin,
                    len: t.len,
                }), templ);
                /*
                return [{
                    _id: null,
                    day: m.toDate(),
                    calendar_id: calendar_id,
                    begin: 1,
                    len: 2
                }];
                */
            }
            return [];
        } , days));

        const deleted = await this.store.dayOpeningHoursModel.deleteMany({
            calendar_id: calendar_id,
            day: { '$gte': start_day, '$lt': end_day }
        });

        const inserted = await this.store.dayOpeningHoursModel.insertMany(new_ohs);

        const ohs = await this.store.dayOpeningHoursModel.find({
            calendar_id: calendar_id,
            day: { '$gte': start_day, '$lt': end_day }
        });
        return ohs;
    }

    async deleteOH(_id: string): Promise<IDeleteResponse> {
        const del = await this.store.dayOpeningHoursModel.findByIdAndRemove(_id);
        if (del) {
            return { ok: true, _id: del._id};
        }
        return {ok: false, _id: _id};
    }

    async _shortenEvent(_id, new_len): Promise<ICalendarEvent> {
        const event = await this.store.calendarEventModel.findById(_id);
        if (!event) {
            throw new Error('Something bad happened');
        }
        // tslint:disable-next-line:max-line-length
        const overlap_check = R.map( s => (M(event.day).utc().format('YYYY-MM-DD') + '#' + s), R.range(event.begin, event.begin + new_len) );
        event.set({
            len: new_len,
            overlap_check
        });
        return event.save();
    }

    // tslint:disable-next-line:max-line-length
    async createEvent(calendar_id: string, event_type_id: string,  client: ICalendarEventClient,  day: Date, begin: number, comment: string, extra_mode: boolean): Promise<ICalendarEvent> {
        console.log('createEvent', M(day).toISOString(), event_type_id);

        const event_type = await this.store.calendarEventTypeModel.findById(event_type_id);
        if (!event_type) {
            A_ds_log(this.context, 'createEvent', {ok: false, msg: 'missing event_type'});
            throw new Error('Something bad happened');
        }
        if (event_type.calendar_id.toString() !== calendar_id.toString()) {
            A_ds_log(this.context, 'createEvent', {ok: false, msg: 'diff calendar_id'});
            throw new Error('Something bad happened');
        }

        const len = extra_mode ? event_type.short_len : event_type.len;
        const event_range = R.range(begin, begin + len);

        if (extra_mode) {

            const events = await this._getCalendarDayEvents(calendar_id, day);

            const c_event = R.find<ICalendarEvent>( e => {
                const er = R.range(e.begin, e.begin + e.len);
                if (R.intersection(er, event_range).length) {
                    return true;
                }
                return false;
            }, events);
            if (c_event) {
                const ce_event_type = await this.store.calendarEventTypeModel.findById(c_event.event_type_id);
                if (!ce_event_type) {
                    A_ds_log(this.context, 'createEvent', {ok: false, msg: 'missing event_type 2'});
                    throw new Error('Something bad happened');
                }
                const ser = R.range(c_event.begin, c_event.begin + ce_event_type.short_len);
                if (R.intersection(ser, event_range).length) {
                    A_ds_log(this.context, 'createEvent', {ok: false, msg: 'no space?'});
                    throw new Error('Something bad happened');
                }
                const se = await this._shortenEvent(c_event._id, ce_event_type.short_len);
            }
        }


        const overlap_check = R.map( s => (M(day).utc().format('YYYY-MM-DD') + '#' + s), event_range );
        const client_nd_search = remove_client_dia(client);
        const rs = await this.store.calendarEventModel.create({
            calendar_id,
            event_type_id,
            event_name: event_type.name,
            client,
            client_nd_search,
            color: event_type.color,
            day,
            begin,
            len,
            full_len: event_type.len,
            shortable_len: event_type.short_len,
            comment,
            overlap_check
        });
        A_ds_log(this.context, 'createEvent', {ok: true, event: (rs ? rs.toObject() : null)});
        return rs;
    }

    // tslint:disable-next-line:max-line-length
    async updateEvent(_id: string, event_type_id: string,  client: ICalendarEventClient,  day: Date, begin: number, comment: string, extra_mode: boolean): Promise<ICalendarEvent> {
        console.log('updateEvent', M(day).toISOString(), event_type_id);

        const event = await this.store.calendarEventModel.findById(_id);
        if (!event) {
            A_ds_log(this.context, 'updateEvent', {ok: false, msg: 'missing event'});
            throw new Error('Something bad happened');
        }

        const event_type = await this.store.calendarEventTypeModel.findById(event_type_id);
        if (!event_type) {
            A_ds_log(this.context, 'updateEvent', {ok: false, msg: 'missing event_type'});
            throw new Error('Something bad happened');
        }
        if (event_type.calendar_id.toString() !== event.calendar_id.toString()) {
            A_ds_log(this.context, 'updateEvent', {ok: false, msg: 'diff calendar_id'});
            throw new Error('Something bad happened');
        }

        const len = extra_mode ? event_type.short_len : event_type.len;
        const event_range = R.range(begin, begin + len);

        const overlap_check = R.map( s => (M(day).utc().format('YYYY-MM-DD') + '#' + s), event_range );
        const client_nd_search = remove_client_dia(client);
        event.set({
            event_type_id,
            event_name: event_type.name,
            client,
            client_nd_search,
            color: event_type.color,
            day,
            begin,
            len,
            full_len: event_type.len,
            shortable_len: event_type.short_len,
            comment,
            overlap_check
        });
        const rs = await event.save();
        A_ds_log(this.context, 'updateEvent', {ok: true, event: (rs ? rs.toObject() : null)});
        return rs;

    }

    async deleteEvent(_id: string): Promise<IDeleteResponse> {
        const del = await this.store.calendarEventModel.findByIdAndRemove(_id);
        if (del) {
            A_ds_log(this.context, 'deleteEvent', {ok: true});
            return { ok: true, _id: del._id};
        }
        A_ds_log(this.context, 'deleteEvent', {ok: false});
        return {ok: false, _id: _id};
    }

    async searchCalendarEvents(search: string, calendar_ids: string[], start_date: Date, end_date: Date): Promise<ICalendarEvent[]> {

        const srch = safe_remove_dia(search);
        const events = await this.store.calendarEventModel.find({
            calendar_id: { $in: calendar_ids},
            day: { '$gte': start_date, '$lt': end_date },
            'client_nd_search.last_name': { '$eq': srch}
        });
        return events;
    }

    async getCalendarEventTypes(calendar_id: string): Promise<ICalendarEventType[]> {
        return this.store.calendarEventTypeModel.find({calendar_id: calendar_id});
    }
    async getCalendarStatusDays(calendar_id: string, start_date: Date, end_date: Date): Promise<ICalendarStatusDays> {
        const m =  await this.getCalendarStatusDaysMulti([calendar_id], start_date, end_date);
        return m[0];
    }

    async getCalendarStatusDaysMulti(calendar_ids: string[], start_date: Date, end_date: Date): Promise<ICalendarStatusDays[]> {
        console.log('getCalendarStatusDaysMulti', M(start_date).toISOString(), M(end_date).toISOString());

        const calendars = await this.store.calendarModel.find({
            _id: { $in: calendar_ids},
        });

        const ohs = await this.store.dayOpeningHoursModel.find({
            calendar_id: { $in: calendar_ids},
            day: { '$gte': start_date, '$lt': end_date }
        });

        const events = await this.store.calendarEventModel.find({
            calendar_id: { $in: calendar_ids},
            day: { '$gte': start_date, '$lt': end_date }
        });
        const calEventsGroups = R.groupBy<ICalendarEvent>(R.prop('calendar_id'), events);
        const calGroups = R.groupBy<IDayOpeningHours>(R.prop('calendar_id'), ohs);
        const days_count = M(end_date).diff(start_date, 'days');

        const days = R.range(0, days_count).map(i => M(start_date).utc().add(i, 'day'));

        const oo = calendar_ids.map(cid => {
            const gr = R.has(cid, calGroups) ? (R.groupBy<IDayOpeningHours>((i) => M(i.day).utc().toISOString(), calGroups[cid])) : {};
            // tslint:disable-next-line:max-line-length
            const egr = R.has(cid, calEventsGroups) ? (R.groupBy<ICalendarEvent>((i) => M(i.day).utc().toISOString(), calEventsGroups[cid])) : {};

            const cal: ICalendar = R.find<ICalendar>( R.propEq('id', cid), calendars);
            const sdays = days.map(_d => {
                const d = _d.toISOString();
                const any_ohs = R.has(d, gr);
                const any_event = R.has(d, egr);
                let any_free = true;
                let any_extra_free = false;
                let any_extra = false;  // TODO
                const cluster_len = cal ? cal.cluster_len : 1;

                //

                if (any_ohs && any_event) {
                    // console.log(`CS: ${cid} ${d}`);
                    const d_ohs = gr[d];
                    const d_events = egr[d];

                    // tslint:disable-next-line:max-line-length
                    const ohs_slots = R.uniq(R.flatten<number>(R.map<IDayOpeningHours, number[]>(oh => R.range(oh.begin, oh.begin + oh.len), d_ohs)));

                    const ohs_non_extra_slots = R.filter<number>(s => !(s % cluster_len), ohs_slots);
                    const ohs_extra_slots = R.filter<number>(s => !!(s % cluster_len), ohs_slots);

                    // tslint:disable-next-line:max-line-length
                    const event_slots = R.uniq(R.flatten<number>(R.map<ICalendarEvent, number[]>(e => R.range(e.begin, e.begin + e.len), d_events)));
                    // tslint:disable-next-line:max-line-length
                    const event_slots_short = R.uniq(R.flatten<number>(R.map<ICalendarEvent, number[]>(e => R.range(e.begin, e.begin + e.shortable_len), d_events)));
                    // console.log("XXX events:",cid,d,event_slots,event_slots_short);
                    // console.log("XXX ohs:",cid,d,ohs_slots,ohs_non_extra_slots);
                    //
                    const event_first_slots = R.map<ICalendarEvent, number>(e => e.begin, d_events);

                    const ints = R.intersection(ohs_non_extra_slots, event_slots);
                    any_free = !(ints.length === ohs_non_extra_slots.length);
                    const intse = R.intersection(ohs_slots, event_slots_short);
                    any_extra_free = !(intse.length === ohs_slots.length);

                    any_extra = !!R.intersection(ohs_extra_slots, event_first_slots).length;

                } else {
                    if (any_event) {
                        any_free = false;
                        // events without ohs!!!
                    }
                }
                return {day: _d.toDate(), any_ohs, any_free, any_extra_free, any_extra, any_event};
            });
            return { calendar_id: cid, days: sdays};
        });

        return oo;
    }

    // tslint:disable-next-line:max-line-length
    async createET(calendar_id: string, name: string, match_key: string, color: string, len: number, short_len: number, order: number): Promise<ICalendarEventType> {
        return this.store.calendarEventTypeModel.create({
            calendar_id,
            name,
            match_key,
            color,
            len,
            short_len,
            order
        });
    }

    // tslint:disable-next-line:max-line-length
    async updateET(_id: string,  name: string, match_key: string, color: string, len: number, short_len: number, order: number): Promise<ICalendarEventType> {
        const cal = await this.store.calendarEventTypeModel.findById(_id);
        if (!cal) {
            throw new Error('Something bad happened');
        }
        cal.set({name, match_key, color, len, short_len, order});
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
