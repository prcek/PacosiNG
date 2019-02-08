
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore } from './../store';
import { IContextBase, ICalendar , IOpeningHoursTemplate, IDeleteResponse} from './../types';


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

}
