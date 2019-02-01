
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore , ICalendarModel} from './../store';
import { IContextBase, ICalendar } from './../types';


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

    async createCalendar(name: string, span: number): Promise<ICalendar> {
        return this.store.calendarModel.create({
            name,
            span,
        });
    }
    async updateCalendar(_id: string, name: string, span: number): Promise<ICalendar> {
        const cal = await this.store.calendarModel.findById(_id);
        if (!cal) {
            throw new Error('Something bad happened');
        }
        cal.set({name, span});
        return cal.save();
    }

}
