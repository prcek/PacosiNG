
import { DataSource } from 'apollo-datasource';
import { IStore , IUserModel} from './store';

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));

export class HeroAPI implements DataSource {
    bigArray: string[];
    context: any;
    constructor(private store: IStore) {
        console.log('new HeroAPI');
        this.bigArray = new Array(100000).fill('a');
    }
    initialize(config) {
        this.context = config.context;
        // console.log(this.store);
    }
    async getHello() {
        // await timeout(10);
        // return 'name';
        return this.context.user.name;
    }
}

export class UserAPI implements DataSource {
    bigArray: string[];
    context: any;
    constructor(private store: IStore) {
        console.log('new UserAPI');
        this.bigArray = new Array(100000).fill('a');
    }
    initialize(config) {
        this.context = config.context;
        // console.log(this.store);
    }
    async getAllUsers(): Promise<IUserModel[]> {
        return this.store.userModel.find({});
    }
}

export function createDataSources(store: IStore) {
    return  {
        hero: new HeroAPI(store),
        user: new UserAPI(store)
    };
}
