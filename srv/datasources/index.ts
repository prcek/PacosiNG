

import { IStore  } from './../store';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import { HeroAPI } from './hero';
import { UserAPI } from './user';
import { CalendarAPI } from './calendar';

export { HeroAPI } from './hero';
export { UserAPI } from './user';
export { CalendarAPI } from './calendar';

export interface IDataSources extends DataSources<any> {
    hero: HeroAPI;
    user: UserAPI;
    calendar: CalendarAPI;
}

export function createDataSources(store: IStore): IDataSources {
    console.log('createDataSources');
    return  {
        hero: new HeroAPI(store),
        user: new UserAPI(store),
        calendar: new CalendarAPI(store)
    };
}
