
import { DataSource } from 'apollo-datasource';
import { IStore } from './store'; 

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))

export class HeroAPI implements DataSource {
    bigArray: string[];
    context: any;
    constructor(private store: IStore) {
        console.log("new HeroAPI");
        this.bigArray = new Array(100000).fill('a');     
    }
    initialize(config) {
        this.context = config.context;
        console.log(this.store);
    }
    async getHello() {
        await timeout(1000);
        return this.context.user.name;
    }
}

export function createDataSources(store: IStore) {
    return  {
        hero: new HeroAPI(store)
    }
}