import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

//import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server';
//import { DataSource } from 'apollo-datasource';
import { ApolloServer } from 'apollo-server-express';
import { createDataSources } from './datasources';
import { schema } from './schema';



const store = { model1:"x", model2:"b",  x:1};


const apollo_server = new ApolloServer({
    schema,
    dataSources: () => (createDataSources(store)),
    context: ({ req }) => {
        // get the user token from the headers
        console.log("setting context ");
        return { user: { name: 'pepa'} };
    },
    introspection: true,
    playground: true
});



const app = express();

const PORT = process.env.PORT || 4000;

app.use(cookieParser());
apollo_server.applyMiddleware({app,path:'/graphql'});

app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});
//server.listen().then(({ url }) => {
//    console.log(`🚀 Server ready at ${url}`)
//});