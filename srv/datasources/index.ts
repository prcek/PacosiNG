

import { IStore  } from './../store';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import { HeroAPI } from './hero';
import { UserAPI } from './user';

export { HeroAPI } from './hero';
export { UserAPI } from './user';

export interface IDataSources extends DataSources<any> {
    hero: HeroAPI;
    user: UserAPI;
}

export function createDataSources(store: IStore): IDataSources {
    console.log('createDataSources');
    return  {
        hero: new HeroAPI(store),
        user: new UserAPI(store)
    };
}
