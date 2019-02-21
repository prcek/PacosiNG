


import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { IUser, ICalendar, IOpeningHoursTemplate, IDayOpeningHours, ICalendarEventType, ICalendarEvent } from './types';
import { config } from './config';

async function startLocalMongoDB(): Promise<string> {
    const mongod = new MongoMemoryServer();
    return mongod.getConnectionString();
}

async function createMongooseConnection(mongoUri: string): Promise<mongoose.Connection> {
    const mongooseOpts = { // options for mongoose 4.11.3 and above
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    };

    const mongoose_connection = await mongoose.createConnection(mongoUri, mongooseOpts);
    console.log(`Mongoose successfully connected to ${mongoUri}`);
    const info = await mongoose_connection.db.admin().buildInfo();
    console.log(`mongodb version ${info.version}`);
    return mongoose_connection;
}

export interface IUserModel extends mongoose.Document, IUser {
    password: string;
}

export interface ICalendarModel extends mongoose.Document, ICalendar {
}

export interface IOpeningHoursTemplateModel extends mongoose.Document, IOpeningHoursTemplate {
}

export interface IDayOpeningHoursModel extends mongoose.Document, IDayOpeningHours {
}

export interface ICalendarEventTypeModel extends mongoose.Document, ICalendarEventType {
    overlap_check: string[];
}

export interface ICalendarEventModel extends mongoose.Document, ICalendarEvent {
}

function createModels(connection: mongoose.Connection) {
    const userSchema = new mongoose.Schema({
        login: {type: String, index: true, unique: true},
        password: String,
        name: String,
        sudo: Boolean,
        roles: [String],
    });
    const UserModel = connection.model<IUserModel>('User', userSchema, 'users');

    const calendarSchema = new mongoose.Schema({
        archived: Boolean,
        name: String,
        span: Number,
        day_begin: Number,
        day_len: Number,
        week_days: [Number],
    });
    const CalendarModel = connection.model<ICalendarModel>('Calendar', calendarSchema, 'calendars');


    const openingHoursTemplateSchema = new mongoose.Schema({
        calendar_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calendar',
            required: true
        },
        week_day: Number,
        begin: Number,
        len: Number,
    });
    const OpeningHoursTemplateModel = connection.model<IOpeningHoursTemplateModel>('OpeningHoursTemplate',
        openingHoursTemplateSchema, 'ohtemplates');

    const dayOpeningHoursSchema = new mongoose.Schema({
        calendar_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calendar',
            required: true
        },
        day: Date,
        begin: Number,
        len: Number,
    });
    const DayOpeningHoursModel = connection.model<IDayOpeningHoursModel>('DayOpeningHours',
        dayOpeningHoursSchema, 'dayohs');

    const calendarEventTypeSchema = new mongoose.Schema({
        calendar_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calendar',
            required: true
        },
        name: String,
        color: String,
        len: Number,
        order: Number,
    });
    const CalendarEventTypeModel = connection.model<ICalendarEventTypeModel>('CalendarEventType',
        calendarEventTypeSchema, 'calendar_ets');


    const calendarEventSchema = new mongoose.Schema({
        calendar_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calendar',
            required: true
        },
        event_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CalendarEventType',
            required: true
        },
        event_name: String,
        client: {
            first_name: String,
            last_name: String,
            title: String,
            phone: String,
            year: Number
        },
        color: String,
        day: Date,
        begin: Number,
        len: Number,
        comment: String,
        overlap_check: [String],
    });

    calendarEventSchema.index({calendar_id: 1, overlap_check: 1}, { unique: true });

    const CalendarEventModel = connection.model<ICalendarEventModel>('CalendarEvent',
        calendarEventSchema, 'calendar_events');


    return { UserModel, CalendarModel, OpeningHoursTemplateModel, DayOpeningHoursModel, CalendarEventTypeModel, CalendarEventModel} ;
}

export interface IStore  {
    userModel: mongoose.Model<IUserModel>;
    calendarModel: mongoose.Model<ICalendarModel>;
    openingHoursTemplateModel: mongoose.Model<IOpeningHoursTemplateModel>;
    dayOpeningHoursModel: mongoose.Model<IDayOpeningHoursModel>;
    calendarEventTypeModel: mongoose.Model<ICalendarEventTypeModel>;
    calendarEventModel: mongoose.Model<ICalendarEventModel>;
}
export async function createStore(productionMode: boolean): Promise<IStore> {

    const uri = productionMode ? config.mongodb_uri : await startLocalMongoDB();
    const mdb = await createMongooseConnection(uri);
    const models = createModels(mdb);
    return {
        userModel: models.UserModel,
        calendarModel: models.CalendarModel,
        openingHoursTemplateModel: models.OpeningHoursTemplateModel,
        dayOpeningHoursModel: models.DayOpeningHoursModel,
        calendarEventTypeModel: models.CalendarEventTypeModel,
        calendarEventModel: models.CalendarEventModel
    };
}

export async function setupDevStoreRawData(store: IStore): Promise<boolean> {
    // const adminUser = await store.userModel.create({login: 'admin', password: 'secret', sudo: true, roles: ['super']});
    return true;
}
