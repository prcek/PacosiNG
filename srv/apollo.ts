
import {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';
import { createStore, setupDevStoreRawData, IStore } from './store';
import { IContextBase } from './types';
import { Context } from 'apollo-server-core';

let global_counter = 1;


export async function createAndRegisterApolloServer(app: Express, productionMode: boolean) {

    const store = await createStore();
    await createStoreDummyData(store);
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


export async function createStoreDummyData(store: IStore): Promise<boolean> {
    const dataSources = createDataSources(store);
    const auser = await dataSources.user.createUser('admin', 'secret', true, ['super']);
    console.log('dummy user created', auser);
    return true; // store_setup_res;
}
