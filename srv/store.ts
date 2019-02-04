


import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { IUser, ICalendar, IOpeningHoursTemplate } from './types';
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


    return { UserModel, CalendarModel, OpeningHoursTemplateModel} ;
}

export interface IStore  {
    userModel: mongoose.Model<IUserModel>;
    calendarModel: mongoose.Model<ICalendarModel>;
    openingHoursTemplateModel: mongoose.Model<IOpeningHoursTemplateModel>;
}
export async function createStore(productionMode: boolean): Promise<IStore> {

    const uri = productionMode ? config.mongodb_uri : await startLocalMongoDB();
    const mdb = await createMongooseConnection(uri);
    const models = createModels(mdb);
    return {
        userModel: models.UserModel,
        calendarModel: models.CalendarModel,
        openingHoursTemplateModel: models.OpeningHoursTemplateModel
    };
}

export async function setupDevStoreRawData(store: IStore): Promise<boolean> {
    // const adminUser = await store.userModel.create({login: 'admin', password: 'secret', sudo: true, roles: ['super']});
    return true;
}
