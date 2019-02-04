
import {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';
import { createStore, setupDevStoreRawData, IStore } from './store';
import { IContextBase, IToken, IUser } from './types';
import { Context } from 'apollo-server-core';
import { decodeAuthToken } from './datasources/user';
import { config } from './config';

let global_counter = 1;


export async function createAndRegisterApolloServer(app: Express, productionMode: boolean) {

    const store = await createStore(productionMode);
    if (productionMode) {
       // await createStoreDummyData(store);
    } else {
        await createStoreDummyData(store);
    }
    const apollo_server = new ApolloServer({
        schema,
        dataSources: () => (createDataSources(store)),
        context: async ({ req }): Promise<Context<IContextBase>> => {
            // get the user token from the headers
            let token = null;

            if ( req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                token =  req.headers.authorization.split(' ')[1];
            } else if (req.cookies && req.cookies.auth) {
                token = req.cookies.auth;
            }
            let user: IUser = null;
            if (token) {
                user = decodeAuthToken(token);
            }


            global_counter++;
            return { user, global_counter, big: new Array(100000).fill('b') };
        },
        introspection: true,
        playground: {
            settings: {
                'request.credentials': 'include'
            }
        }
    });

    apollo_server.applyMiddleware({app, path: '/graphql'});

}


export async function createStoreDummyData(store: IStore): Promise<boolean> {
    const dataSources = createDataSources(store);
    const auser = await dataSources.user.createUser('admin', 'secret', 'Administrator', true, ['super']);
    console.log('dummy user created', auser);
    const cal1 = await dataSources.calendar.createCalendar('cal1', 15, 4 * 7, 4 * 10, [1, 2, 3, 4, 5]);
    const cal2 = await dataSources.calendar.createCalendar('cal2', 10, 6 * 7, 6 * 10, [1, 2, 3, 4, 5]);
    const cal3 = await dataSources.calendar.createCalendar('cal3', 30, 2 * 7, 2 * 10, [1, 2, 3, 4, 5]);


    const c1oht1  = await dataSources.calendar.createOHTemplate(cal1._id, 1, 40, 5);
    const c1oht2  = await dataSources.calendar.createOHTemplate(cal1._id, 1, 50, 5);

    console.log('dummy cals created', cal1, cal2, cal3, c1oht1, c1oht2);

    return true; // store_setup_res;
}
