import { ApolloServer, gql } from 'apollo-server';
import { DataSource } from 'apollo-datasource';

console.log('hello!');

// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: (parent, args, context, info) => { 
        return context.dataSources.hero.getHello();
    }
  }
};

class HeroAPI implements DataSource {
    bigArray: string[];
    context: any;
    constructor(private store) {
        console.log("new HeroAPI");
        this.bigArray = new Array(100000).fill('a');     
    }
    initialize(config) {
        this.context = config.context;
        console.log(this.store);
    }
    getHello() {
        return this.context.user.name;
    }
}

const store = { x:1};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ hero: new HeroAPI(store)}),
    context: ({ req }) => {
        // get the user token from the headers
        console.log("setting context ");
        return { user: { name: 'pepa'} };
    },
    introspection: true,
    playground: true
});


server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
});