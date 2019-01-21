import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore } from '../store';
import { IContextBase } from '../types';

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


