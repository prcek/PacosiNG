

import { gql, makeExecutableSchema, IResolvers } from 'apollo-server';
import { IDataSources } from './datasources';
import { IContextBase, ILoginResponse, IUser, ICalendar} from './types';


// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    users: [User]
    calendars: [Calendar]
    me: User
  }
  type Mutation {
    login(login: String! password: String!): LoginResponse!
    relogin: LoginResponse!
    updateUser(login: String! name: String sudo: Boolean roles: [String]): User!
    updateCalendar(_id: ID! name: String span: Int day_begin: Int day_len: Int week_days: [Int]): Calendar!
    createCalendar(name: String! span: Int! day_begin: Int! day_len: Int! week_days: [Int]!): Calendar!
  }
  ### ILoginResponse interface
  type LoginResponse {
    ok: Boolean
    token: String
    user: User
  }
  ### IUser interface
  type User {
    login: String
    name: String
    sudo: Boolean
    roles: [String]
  }
  type Calendar {
    _id: ID
    name: String
    span: Int
    day_begin: Int
    day_len: Int
    week_days: [Int]
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
    users: async (parent, args, context, info): Promise<IUser[]> => {
        const ds: IDataSources = context.dataSources;
        return await ds.user.getAllUsers();
    },
    calendars: async (parent, args, context, info): Promise<ICalendar[]> => {
        return await context.dataSources.calendar.getAllCalendars();
    },
    me: async (parent, args, context, info): Promise<IUser> => {
      return await context.dataSources.user.getMe();
    },
  },
  Mutation: {
    login: async (_, { login, password }, { dataSources }): Promise<ILoginResponse> =>
        dataSources.user.login(login, password),

    relogin: async (_, __, { dataSources }): Promise<ILoginResponse> =>
        dataSources.user.relogin(),

    updateUser: (_, { login, name, sudo, roles }, { dataSources }): Promise<IUser> =>
        dataSources.user.updateUser(login, name, sudo, roles),


    updateCalendar: (_, { _id, name, span, day_begin, day_len, week_days }, { dataSources }): Promise<ICalendar> =>
        dataSources.calendar.updateCalendar(_id, name, span, day_begin, day_len, week_days),

    createCalendar: (_, { name, span , day_begin, day_len, week_days}, { dataSources }): Promise<ICalendar> =>
        dataSources.calendar.createCalendar(name, span, day_begin, day_len, week_days),

  }

};


export const schema = makeExecutableSchema<IContext>({typeDefs, resolvers});
