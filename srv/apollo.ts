
import {Express} from 'express';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';
import { createStore, setupDevStoreRawData, IStore } from './store';
import { IContextBase, IToken, IUser } from './types';
import { Context } from 'apollo-server-core';
import { decodeAuthToken } from './datasources/user';
import { config } from './config';
import * as M from 'moment';
import { defaultFieldResolver } from 'graphql';
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
        },
        engine: productionMode
    });

    apollo_server.applyMiddleware({app, path: '/graphql'});

}


export async function createStoreDummyData(store: IStore): Promise<boolean> {
    const dataSources = createDataSources(store);

    const loc_A = await dataSources.location.createLocation('Loc_A', 'loc A address');
    const loc_B = await dataSources.location.createLocation('Loc_B', 'loc B address');

    const cal1 = await dataSources.calendar.createCalendar(loc_A._id, 'cal1', 10, 2, 42, 72, [1, 2, 3, 4, 5], 'print info line');
    const cal2 = await dataSources.calendar.createCalendar(loc_A._id, 'cal2', 15, 2, 6 * 7, 6 * 10, [1, 2, 3, 4, 5], 'print info line');
    const cal3 = await dataSources.calendar.createCalendar(loc_B._id, 'cal3', 15, 1, 28, 2 * 10, [1, 2, 3, 4, 5], 'print info line');

    // tslint:disable-next-line:max-line-length
    const auser = await dataSources.user.createUser('admin', 'secret', 'Administrator', true, ['super', 'view', 'edit', 'setup_ot'], [cal1._id, cal2._id, cal3._id]);
    const duser = await dataSources.user.createUser('doctor', 'secret', 'Doctor', false, ['view'], [cal1._id]);
    const euser = await dataSources.user.createUser('evidence', 'secret', 'Evidence', false, ['view', 'edit'], [cal1._id, cal2._id]);
    // tslint:disable-next-line:max-line-length
    const suser = await dataSources.user.createUser('plan', 'secret', 'Planovac', false, ['setup_ot', 'view', 'edit'], [cal1._id, cal2._id]);


    const c1oht1  = await dataSources.calendar.createOHTemplate(cal1._id, 1, 42, 26);
    const c1oht2  = await dataSources.calendar.createOHTemplate(cal1._id, 1, 72, 18);
    const c1oht3  = await dataSources.calendar.createOHTemplate(cal1._id, 2, 42, 26);

    const c2oht1  = await dataSources.calendar.createOHTemplate(cal2._id, 3, 40, 5);
    const c2oht2  = await dataSources.calendar.createOHTemplate(cal2._id, 1, 50, 5);

    console.log('dummy cals created', cal1, cal2, cal3, c1oht1, c1oht2);
    const today = M().utc().startOf('day').toDate();
    const tom = M(today).add(1, 'days').toDate();
    const nextweek = M(today).add(7, 'days').toDate();
    const nextweek2 = M(today).add(10, 'days').toDate();
    await dataSources.calendar.createOH(cal1._id, today, 42, 26);
    await dataSources.calendar.createOH(cal1._id, today, 72, 18);
    await dataSources.calendar.createOH(cal1._id, nextweek, 72, 10);
    await dataSources.calendar.createOH(cal1._id, tom, 42, 6);
    await dataSources.calendar.createOH(cal1._id, nextweek2, 42, 10);

    const ud1 = await dataSources.calendar.createET(cal1._id, 'ud1', 'k1', 'red', 1, 1, 1);
    const ud2 = await dataSources.calendar.createET(cal1._id, 'ud2', 'k2', 'blue', 2, 1, 1);
    const ud3 = await dataSources.calendar.createET(cal1._id, 'ud3', 'k3', 'green', 3, 2, 1);

    const ud1b = await dataSources.calendar.createET(cal2._id, 'ud1_b', 'k1', 'red', 1, 1, 1);
    const ud2b = await dataSources.calendar.createET(cal2._id, 'ud2_b', 'k2', 'blue', 2, 1, 1);
    const ud3b = await dataSources.calendar.createET(cal2._id, 'ud3_b', 'k3', 'green', 3, 3, 1);

    const ud1c = await dataSources.calendar.createET(cal3._id, 'kratka', 'k', 'red', 1, 1, 1);
    const ud2c = await dataSources.calendar.createET(cal3._id, 'dlouha', 'd', 'blue', 2, 2, 2);



    await dataSources.calendar.createOH(cal2._id, today, 40, 5);
    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal2._id, ud1b._id, { first_name: 'reg', last_name: 'reg', year: 1990, title: null, phone: null },  today, 40, '', false);
    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal2._id, ud3b._id, { first_name: 'reg', last_name: 'reg', year: 1990, title: null, phone: null },  today, 42, '', false);

    await dataSources.calendar.createOH(cal3._id, today, 40, 4);



    const planC2 = await dataSources.calendar.planOH(cal2._id, nextweek, nextweek2);

    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal1._id, ud1._id, { first_name: 'karel', last_name: 'vomacka', year: 1990, title: null, phone: null },  today, 42, 'poznamka', false);
    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal1._id, ud2._id, { first_name: 'jiri', last_name: 'duchna', year: 1990, title: null, phone: null },  today, 50, '', false);
    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal1._id, ud3._id, { first_name: 'marie', last_name: 'janeckova', year: 1990, title: null, phone: null },  tom, 37, '', false);
    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal1._id, ud2._id, { first_name: 'ferda', last_name: 'mravenec', year: 2010, title: null, phone: null },  tom, 35, '', false);

    // tslint:disable-next-line:max-line-length
    await dataSources.calendar.createEvent(cal1._id, ud2._id, { first_name: 'extra', last_name: 'extra', year: 1990, title: null, phone: null },  today, 51, '', true);

    return true; // store_setup_res;
}
