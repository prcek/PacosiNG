

import { IStore  } from './../store';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import { HeroAPI } from './hero';
import { UserAPI } from './user';
import { CalendarAPI } from './calendar';
import { LocationAPI } from './location';

export { HeroAPI } from './hero';
export { UserAPI } from './user';
export { CalendarAPI } from './calendar';
export { LocationAPI } from './location';

export interface IDataSources extends DataSources<any> {
    hero: HeroAPI;
    user: UserAPI;
    calendar: CalendarAPI;
    location: LocationAPI;
}

export function createDataSources(store: IStore): IDataSources {
    console.log('createDataSources');
    return  {
        hero: new HeroAPI(store),
        user: new UserAPI(store),
        calendar: new CalendarAPI(store),
        location: new LocationAPI(store),
    };
}
