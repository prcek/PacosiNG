

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
  ICalendarEventType,
  ICalendarStatusDays,
  ICalendarEvent,
  ILocation
} from './types';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

// The GraphQL schema
// tslint:disable:max-line-length
const typeDefs = gql`
  scalar Date
  scalar Time
  scalar DateTime

  type Query {
    "A simple type for getting started!"
    hello: String
    users: [User]
    calendars(all: Boolean, ids: [ID]): [Calendar]
    calendar(_id: ID!): Calendar
    locations(all: Boolean, ids: [ID]): [Location]
    location(_id: ID!): Location
    openingHoursTemplates: [OpeningHoursTemplate]
    calendarOpeningHoursTemplates(calendar_id: ID!): [OpeningHoursTemplate]
    calendarEventTypes(calendar_id: ID!): [CalendarEventType]
    calendarOpeningHours(calendar_id: ID! start_date: Date! end_date: Date!): [DayOpeningHours]
    calendarEvents(calendar_id: ID! start_date: Date! end_date: Date!): [CalendarEvent]
    calendarStatusDays(calendar_id: ID! start_date: Date!, end_date: Date!): CalendarStatusDays
    calendarStatusDaysMulti(calendar_ids: [ID]! start_date: Date!, end_date: Date!): [CalendarStatusDays]
    me: User
  }
  type Mutation {
    login(login: String! password: String!): LoginResponse!
    relogin: LoginResponse!
    updateUser(login: String! password: String name: String sudo: Boolean roles: [String] calendar_ids: [String]): User!
    createUser(login: String! password: String! name: String! sudo: Boolean! roles: [String]! calendar_ids: [String]!): User!
    updateCalendar(_id: ID! archived: Boolean location_id: ID name: String span: Int day_begin: Int day_len: Int week_days: [Int]): Calendar!
    createCalendar(location_id: ID! name: String! span: Int! day_begin: Int! day_len: Int! week_days: [Int]!): Calendar!

    updateLocation(_id: ID! archived: Boolean name: String address: String): Location!
    createLocation(name: String! address: String!): Location!

    createOpeningHoursTemplate(calendar_id: ID! week_day: Int! begin: Int! len: Int!): OpeningHoursTemplate!
    deleteOpeningHoursTemplate(_id: ID!): DeleteResponse!

    createOpeningHours(calendar_id: ID! day: Date! begin: Int! len: Int!): DayOpeningHours!
    deleteOpeningHours(_id: ID!): DeleteResponse!

    createCalendarEventType(calendar_id: ID! name: String! match_key: String! color: String! len: Int! order: Int!): CalendarEventType!
    updateCalendarEventType(_id: ID! name: String  match_key: String color: String len: Int order: Int): CalendarEventType!
    deleteCalendarEventType(_id: ID!): DeleteResponse!



    createCalendarEvent(calendar_id: ID! client: CalendarEventClientInput! event_type_id: ID! day: Date! begin: Int! comment: String!): CalendarEvent!
    updateCalendarEvent(_id: ID! client: CalendarEventClientInput! event_type_id: ID!  day: Date! begin: Int! comment: String!): CalendarEvent!
    deleteCalendarEvent(_id: ID!): DeleteResponse!

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
    calendar_ids: [String]
  }
  type Calendar {
    _id: ID
    archived: Boolean
    location_id: ID
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
    match_key: String
    name: String
    color: String
    len: Int
    order: Int
  }

  type CalendarStatusDays {
    calendar_id: ID
    days: [CalendarStatusDay]
  }

  type CalendarStatusDay {
    day: Date
    any_ohs: Boolean
    any_free: Boolean
    any_event: Boolean
  }

  type CalendarEvent {
    _id: ID
    calendar_id: ID
    event_type_id: ID
    client: CalendarEventClient
    comment: String
    color: String
    event_name: String
    day: Date
    begin: Int
    len: Int
  }
  input CalendarEventClientInput {
    first_name: String
    last_name: String
    title: String
    phone: String
    year: Int
  }
  type CalendarEventClient {
    first_name: String
    last_name: String
    title: String
    phone: String
    year: Int
  }
  type Location {
    _id: ID
    archived: Boolean
    name: String,
    address: String,
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

    locations: async (parent, {all, ids}, context, info): Promise<ILocation[]> => {
      return await context.dataSources.location.getLocations(all, ids);
    },

    location: async (parent, { _id} , context, info): Promise<ILocation> => {
      return await context.dataSources.location.getLocation(_id);
    },

    calendars: async (parent, {all, ids}, context, info): Promise<ICalendar[]> => {
        return await context.dataSources.calendar.getCalendars(all, ids);
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

    calendarEvents: async (parent, { calendar_id, start_date, end_date } , context, info): Promise<ICalendarEvent[]> => {
      return await context.dataSources.calendar.getCalendarEvents(calendar_id, start_date, end_date);
    },

    calendarEventTypes: async (parent, { calendar_id } , context, info): Promise<ICalendarEventType[]> => {
      return await context.dataSources.calendar.getCalendarEventTypes(calendar_id);
    },

    calendarStatusDays: async (parent, { calendar_id, start_date, end_date } , context, info): Promise<ICalendarStatusDays> => {
      return await context.dataSources.calendar.getCalendarStatusDays(calendar_id, start_date, end_date);
    },
    calendarStatusDaysMulti: async (parent, { calendar_ids, start_date, end_date } , context, info): Promise<ICalendarStatusDays[]> => {
      return await context.dataSources.calendar.getCalendarStatusDaysMulti(calendar_ids, start_date, end_date);
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

    updateUser: (_, { login, password, name, sudo, roles, calendar_ids }, { dataSources }): Promise<IUser> =>
        dataSources.user.updateUser(login, password, name, sudo, roles, calendar_ids),

    createUser: (_, { login, password, name, sudo, roles, calendar_ids }, { dataSources }): Promise<IUser> =>
        dataSources.user.createUser(login, password, name, sudo, roles, calendar_ids),

    updateCalendar: (_, { _id, archived, location_id, name, span, day_begin, day_len, week_days }, { dataSources }): Promise<ICalendar> =>
        dataSources.calendar.updateCalendar(_id, archived, location_id, name, span, day_begin, day_len, week_days),

    createCalendar: (_, { name, location_id, span , day_begin, day_len, week_days}, { dataSources }): Promise<ICalendar> =>
        dataSources.calendar.createCalendar(location_id, name, span, day_begin, day_len, week_days),

    updateLocation: (_, { _id, archived, name, address }, { dataSources }): Promise<ILocation> =>
        dataSources.location.updateLocation(_id, archived, name, address),

    createLocation: (_, { name, address }, { dataSources }): Promise<ILocation> =>
        dataSources.location.createLocation(name, address),


    createOpeningHoursTemplate: (_, { calendar_id, week_day, begin, len }, { dataSources }): Promise<IOpeningHoursTemplate> =>
        dataSources.calendar.createOHTemplate(calendar_id, week_day, begin, len),

    deleteOpeningHoursTemplate: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteOHTemplate(_id),

    createOpeningHours: (_, { calendar_id, day, begin, len }, { dataSources }): Promise<IDayOpeningHours> =>
        dataSources.calendar.createOH(calendar_id, day, begin, len),

    deleteOpeningHours: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteOH(_id),

    createCalendarEventType: (_, { calendar_id, name, match_key, color, len, order }, { dataSources }): Promise<ICalendarEventType> =>
        dataSources.calendar.createET(calendar_id, name, match_key, color, len, order),

    updateCalendarEventType: (_, { _id, name, match_key,  color, len, order }, { dataSources }): Promise<ICalendarEventType> =>
      dataSources.calendar.updateET(_id, name, match_key, color, len, order),

    deleteCalendarEventType: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteET(_id),

    createCalendarEvent: (_, { calendar_id, event_type_id, client, day, begin, comment }, { dataSources }): Promise<ICalendarEvent> =>
        dataSources.calendar.createEvent(calendar_id, event_type_id, client, day, begin, comment),

    updateCalendarEvent: (_, { _id, event_type_id, client, day, begin, comment }, { dataSources }): Promise<ICalendarEvent> =>
      dataSources.calendar.updateEvent(_id, event_type_id, client, day, begin, comment),

    deleteCalendarEvent: (_, { _id }, { dataSources }): Promise<IDeleteResponse> =>
        dataSources.calendar.deleteEvent(_id),

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
