
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore , IUserModel} from './store';
import { IContextBase, IUser } from './types';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));

export class HeroAPI implements DataSource {
    bigArray: string[];
    context: IContextBase;
    constructor(private store: IStore) {
        console.log('new HeroAPI');
        this.bigArray = new Array(100000).fill('a');
    }
    initialize(config: DataSourceConfig<IContextBase>) {
        this.context = config.context;
        // console.log(this.store);
    }
    async getHello() {
        // await timeout(10);
        // return 'name';
        return this.context.user.login;
    }
}

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
}

export interface IDataSources extends DataSources<any> {
    hero: HeroAPI;
    user: UserAPI;
}

export function createDataSources(store: IStore): IDataSources {
    return  {
        hero: new HeroAPI(store),
        user: new UserAPI(store)
    };
}
