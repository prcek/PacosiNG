
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore , IUserModel} from './../store';
import { IContextBase, IUser } from './../types';


import * as bcrypt from 'bcrypt-nodejs';

// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'iddqd';
// const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';



export class UserAPI implements DataSource {
    bigArray: string[];
    context: IContextBase;
    constructor(private store: IStore) {
        console.log('new UserAPI');
        this.bigArray = new Array(100000).fill('a');
    }
    initialize(config: DataSourceConfig<IContextBase>) {
        this.context = config.context;
        // console.log(this.store);
    }
    async getAllUsers(): Promise<IUser[]> {
        return this.store.userModel.find({});
    }
    async getMe(): Promise<IUser> {
        return this.context.user;
    }
    async createUser(login: string, password: string, sudo: boolean, roles: string[]): Promise<IUser> {
        const salt = bcrypt.genSaltSync();
        const ep  = bcrypt.hashSync(password, salt );
        return this.store.userModel.create({
            login,
            password: ep,
            sudo,
            roles
        });
    }
}
