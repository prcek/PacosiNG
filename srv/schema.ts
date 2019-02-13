

import { gql, makeExecutableSchema, IResolvers } from 'apollo-server';
import { IDataSources } from './datasources';
import {
  IContextBase,
  ILoginResponse,
  IUser,
  ICalendar,
  IOpeningHoursTemplate,
  IDeleteResponse,
  IDayOpeningHours,
  ICalendarEventType
} from './types';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

// The GraphQL schema
const typeDefs = gql`
  scalar Date
  scalar Time
  scalar DateTime

  type Query {
    "A simple type for getting started!"
    hello: String
    users: [User]
    calendars: [Calendar]
    calendar(_id: ID!): Calendar
    openingHoursTemplates: [OpeningHoursTemplate]
    calendarOpeningHoursTemplates(calendar_id: ID!): [OpeningHoursTemplate]
    calendarEventTypes(calendar_id: ID!): [CalendarEventType]
    calendarOpeningHours(calendar_id: ID!, start_date: Date!, end_date: Date!): [DayOpeningHours]
    me: User
  }
  type Mutation {
    login(login: String! password: String!): LoginResponse!
    relogin: LoginResponse!
    updateUser(login: String! password: String name: String sudo: Boolean roles: [String]): User!
    createUser(login: String! password: String! name: String! sudo: Boolean! roles: [String]!): User!
    updateCalendar(_id: ID! name: String span: Int day_begin: Int day_len: Int week_days: [Int]): Calendar!
    createCalendar(name: String! span: Int! day_begin: Int! day_len: Int! week_days: [Int]!): Calendar!
    createOpeningHoursTemplate(calendar_id: ID! week_day: Int! begin: Int! len: Int!): OpeningHoursTemplate!
    deleteOpeningHoursTemplate(_id: ID!): DeleteResponse!

    createOpeningHours(calendar_id: ID! day: Date! begin: Int! len: Int!): DayOpeningHours!
    deleteOpeningHours(_id: ID!): DeleteResponse!

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
  type DayOpeningHours {
    _id: ID
    calendar_id: ID
    day: Date
    begin: Int
    len: Int
  }
  type CalendarEventType {
    _id: ID
    calendar_id: ID
    name: String
    color: String
    len: Int
    order: Int
  }

`;

interface IContext extends IContextBase {
  dataSources: IDataSources;
}

// A map of functions which return data for the schema.
const resolvers: IResolvers<any, IContext> = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
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

    calendarOpeningHours: async (parent, { calendar_id, start_date, end_date } , context, info): Promise<IDayOpeningHours[]> => {
      return await context.dataSources.calendar.getCalendarOHs(calendar_id, start_date, end_date);
    },

    calendarEventTypes: async (parent, { calendar_id } , context, info): Promise<ICalendarEventType[]> => {
      return await context.dataSources.calendar.getCalendarEventTypes(calendar_id);
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

    updateUser: (_, { login, password, name, sudo, roles }, { dataSources }): Promise<IUser> =>
        dataSources.user.updateUser(login, password, name, sudo, roles),

    createUser: (_, { login, password, name, sudo, roles }, { dataSources }): Promise<IUser> =>
        dataSources.user.createUser(login, password, name, sudo, roles),

    updateCalendar: (_, { _id, name, span, day_begin, day_len, week_days }, { dataSources }): Promise<ICalendar> =>
        dataSources.calendar.updateCalendar(_id, name, span, day_begin, day_len, week_days),

    createCalendar: (_, { name, span , day_begin, day_len, week_days}, { dataSources }): Promise<ICalendar> =>
        dataSources.calendar.createCalendar(name, span, day_begin, day_len, week_days),

    createOpeningHoursTemplate: (_, { calendar_id, week_day, begin, len }, { dataSources }): Promise<IOpeningHoursTemplate> =>
        dataSources.calendar.createOHTemplate(calendar_id, week_day, begin, len),

    deleteOpeningHoursTemplate: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteOHTemplate(_id),

    createOpeningHours: (_, { calendar_id, day, begin, len }, { dataSources }): Promise<IDayOpeningHours> =>
        dataSources.calendar.createOH(calendar_id, day, begin, len),

    deleteOpeningHours: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteOH(_id),

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
