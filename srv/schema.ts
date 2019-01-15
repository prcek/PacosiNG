

import { gql, makeExecutableSchema } from 'apollo-server';


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


export const schema = makeExecutableSchema({typeDefs, resolvers});