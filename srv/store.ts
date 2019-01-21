


import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { IUser } from './types';

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

function createModels(connection: mongoose.Connection) {
    const userSchema = new mongoose.Schema({
        login: {type: String, index: true, unique: true},
        password: String,
        sudo: Boolean,
        roles: [String],
    });
    const UserModel = connection.model<IUserModel>('User', userSchema, 'users');
    return { UserModel} ;
}

export interface IStore  {
    model1: string;
    model2: string;
    userModel: mongoose.Model<IUserModel>;
    x: number;
}
export async function createStore(): Promise<IStore> {
    const uri = await startLocalMongoDB();
    const mdb = await createMongooseConnection(uri);
    const models = createModels(mdb);
    return { model1: 'a', model2: 'b', x: 1, userModel: models.UserModel};
}

export async function setupDevStoreData(store: IStore): Promise<boolean> {
    const adminUser = await store.userModel.create({login: 'admin', password: 'secret', sudo: true, roles: ['super']});
    return true;
}
