

import { gql, makeExecutableSchema, IResolvers } from 'apollo-server';
import { IDataSources } from './datasources';
import { IContextBase } from './types';


// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    users: [User]
    me: User
  }
  type User {
    login: String
    sudo: Boolean
    roles: [String]
  }
`;

interface IContext extends IContextBase {
  dataSources: IDataSources;
}

// A map of functions which return data for the schema.
const resolvers: IResolvers<any, IContext> = {
  Query: {
    hello: async (parent, args, context, info) => {
        return await context.dataSources.hero.getHello();
    },
    users: async (parent, args, context, info) => {
        const ds: IDataSources = context.dataSources;
        return await ds.user.getAllUsers();
    },
    me: async (parent, args, context, info) => {
      return await context.dataSources.user.getMe();
    },
  }
};


export const schema = makeExecutableSchema<IContext>({typeDefs, resolvers});
