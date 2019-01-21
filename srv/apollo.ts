
import {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';
import { createStore, setupDevStoreData } from './store';
import { IContextBase } from './types';
import { Context } from 'apollo-server-core';

let global_counter = 1;


export async function createAndRegisterApolloServer(app: Express, productionMode: boolean) {

    const store = await createStore();
    const store_setup = await setupDevStoreData(store);
    console.log('setupDevStoreData', store_setup);

    const apollo_server = new ApolloServer({
        schema,
        dataSources: () => (createDataSources(store)),
        context: ({ req }): Context<IContextBase> => {
            // get the user token from the headers
            console.log('setting context ', req.cookies);
            const val = 'pepa' + global_counter;
            global_counter++;
            return { user: { login: val, sudo: false, roles: []}, big: new Array(100000).fill('b') };
        },
        introspection: true,
        playground: true
    });

    apollo_server.applyMiddleware({app, path: '/graphql'});

}
