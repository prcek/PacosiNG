

import { gql, makeExecutableSchema, IResolvers } from 'apollo-server';
import { IDataSources } from './datasources';
import { IContextBase, ILoginResponse, IUser, ICalendar, IOpeningHoursTemplate, IDeleteResponse} from './types';


// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    users: [User]
    calendars: [Calendar]
    calendar(_id: ID!): Calendar
    openingHoursTemplates: [OpeningHoursTemplate]
    calendarOpeningHoursTemplates(calendar_id: ID!): [OpeningHoursTemplate]
    me: User
  }
  type Mutation {
    login(login: String! password: String!): LoginResponse!
    relogin: LoginResponse!
    updateUser(login: String! name: String sudo: Boolean roles: [String]): User!
    updateCalendar(_id: ID! name: String span: Int day_begin: Int day_len: Int week_days: [Int]): Calendar!
    createCalendar(name: String! span: Int! day_begin: Int! day_len: Int! week_days: [Int]!): Calendar!
    createOpeningHoursTemplate(calendar_id: ID! week_day: Int! begin: Int! len: Int!): OpeningHoursTemplate!
    deleteOpeningHoursTemplate(_id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    ok: Boolean
    _id: ID!
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
  type OpeningHoursTemplate {
    _id: ID
    calendar_id: ID
    week_day: Int
    begin: Int
    len: Int
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
    calendar: async (parent, { _id} , context, info): Promise<ICalendar> => {
      return await context.dataSources.calendar.getOneCalendar(_id);
    },
    openingHoursTemplates: async (parent, args, context, info): Promise<IOpeningHoursTemplate[]> => {
        return await context.dataSources.calendar.getAllOHTemplates();
    },

    calendarOpeningHoursTemplates: async (parent, { calendar_id } , context, info): Promise<IOpeningHoursTemplate[]> => {
      return await context.dataSources.calendar.getCalendarOHTemplates(calendar_id);
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

    createOpeningHoursTemplate: (_, { calendar_id, week_day, begin, len }, { dataSources }): Promise<IOpeningHoursTemplate> =>
        dataSources.calendar.createOHTemplate(calendar_id, week_day, begin, len),

    deleteOpeningHoursTemplate: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteOHTemplate(_id),
  }

};


export const schema = makeExecutableSchema<IContext>({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  resolverValidationOptions: {
    requireResolversForArgs: true,
  }
});
