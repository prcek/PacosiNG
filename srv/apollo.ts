
import {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';
import { createStore } from './store';

let global_counter = 1;

export async function createAndRegisterApolloServer(app: Express) {

    const store = await createStore();

    const apollo_server = new ApolloServer({
        schema,
        dataSources: () => (createDataSources(store)),
        context: ({ req }) => {
            // get the user token from the headers
            console.log('setting context ');
            const val = 'pepa' + global_counter;
            global_counter++;
            return { user: { name: val} };
        },
        introspection: true,
        playground: true
    });

    apollo_server.applyMiddleware({app, path: '/graphql'});

}
