import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import { ApolloServer } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';
import { createStore } from './store';

let global_counter = 1;


(async () => {
    
    const app = express();
    const PORT = process.env.PORT || 4000;

    const store = await createStore();

    const apollo_server = new ApolloServer({
        schema,
        dataSources: () => (createDataSources(store)),
        context: ({ req }) => {
            // get the user token from the headers
            console.log("setting context ");
            const val = 'pepa' + global_counter;
            global_counter++;
            return { user: { name: val} };
        },
        introspection: true,
        playground: true
    });
    
    app.use(cookieParser());
    apollo_server.applyMiddleware({app,path:'/graphql'});
    
    app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
    });
  })().catch(e => {
    console.error('global error',e);
  });
  







