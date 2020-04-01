

import { gql, makeExecutableSchema, IResolvers, SchemaDirectiveVisitor } from 'apollo-server';
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
import { defaultFieldResolver } from 'graphql';

import { git_hash } from './git-version';
import { A_gql_log } from './audit';




// The GraphQL schema
// tslint:disable:max-line-length
const typeDefs = gql`
  scalar Date
  scalar Time
  scalar DateTime

  directive @auth_access(
    role: String,
  ) on OBJECT | FIELD_DEFINITION

  type Query {
    "A simple type for getting started!"
    hello: String
    serverHash: String
    users: [User] @auth_access(role:"view")
    calendars(all: Boolean, ids: [ID]): [Calendar] @auth_access(role:"view")
    calendar(_id: ID!): Calendar @auth_access(role:"view")
    locations(all: Boolean, ids: [ID]): [Location] @auth_access(role:"view")
    location(_id: ID!): Location @auth_access(role:"view")
    openingHoursTemplates: [OpeningHoursTemplate] @auth_access(role:"view")
    calendarOpeningHoursTemplates(calendar_id: ID!): [OpeningHoursTemplate] @auth_access(role:"view")
    calendarEventTypes(calendar_id: ID!): [CalendarEventType] @auth_access(role:"view")
    calendarOpeningHours(calendar_id: ID! start_date: Date! end_date: Date!): [DayOpeningHours] @auth_access(role:"view")
    calendarEvents(calendar_id: ID! start_date: Date! end_date: Date!): [CalendarEvent] @auth_access(role:"view")
    calendarEvent(_id: ID!): CalendarEvent @auth_access(role:"view")
    calendarStatusDays(calendar_id: ID! start_date: Date!, end_date: Date!): CalendarStatusDays @auth_access(role:"view")
    calendarStatusDaysMulti(calendar_ids: [ID]! start_date: Date!, end_date: Date!): [CalendarStatusDays] @auth_access(role:"view")
    calendarEventSearch(search: String! calendar_ids: [ID]! start_date: Date!, end_date: Date!): [CalendarEvent] @auth_access(role:"view")

    me: User
  }
  type Mutation {
    login(login: String! password: String!): LoginResponse!
    su(login: String!): LoginResponse!
    relogin: LoginResponse!
    updateUser(login: String! password: String name: String root: Boolean roles: [String] calendar_ids: [String]): User! @auth_access(role:"super")
    createUser(login: String! password: String! name: String! root: Boolean! roles: [String]! calendar_ids: [String]!): User!  @auth_access(role:"super")
    updateCalendar(_id: ID! archived: Boolean location_id: ID name: String span: Int cluster_len: Int day_begin: Int day_len: Int  day_offset: Int, week_days: [Int], print_info: String): Calendar!  @auth_access(role:"super")
    createCalendar(location_id: ID! name: String! span: Int! cluster_len: Int! day_begin: Int! day_len: Int! day_offset: Int! week_days: [Int]!  print_info: String!): Calendar!  @auth_access(role:"super")

    updateLocation(_id: ID! archived: Boolean name: String address: String): Location!  @auth_access(role:"super")
    createLocation(name: String! address: String!): Location!  @auth_access(role:"super")

    createOpeningHoursTemplate(calendar_id: ID! week_day: Int! begin: Int! len: Int!): OpeningHoursTemplate! @auth_access(role:"setup_ot")
    deleteOpeningHoursTemplate(_id: ID!): DeleteResponse! @auth_access(role:"setup_ot")

    createOpeningHours(calendar_id: ID! day: Date! begin: Int! len: Int!): DayOpeningHours! @auth_access(role:"setup_ot")
    deleteOpeningHours(_id: ID!): DeleteResponse! @auth_access(role:"setup_ot")

    planOpeningHours(calendar_id: ID! start_day: Date! end_day: Date!): [DayOpeningHours]  @auth_access(role:"setup_ot")


    createCalendarEventType(calendar_id: ID! name: String! match_key: String! color: String! len: Int! short_len: Int! order: Int!): CalendarEventType!  @auth_access(role:"super")
    updateCalendarEventType(_id: ID! name: String  match_key: String color: String len: Int short_len: Int order: Int): CalendarEventType!  @auth_access(role:"super")
    deleteCalendarEventType(_id: ID!): DeleteResponse!  @auth_access(role:"super")



    createCalendarEvent(calendar_id: ID! client: CalendarEventClientInput! event_type_id: ID! day: Date! begin: Int! comment: String! extra_mode: Boolean): CalendarEvent!  @auth_access(role:"edit")
    updateCalendarEvent(_id: ID! client: CalendarEventClientInput! event_type_id: ID!  day: Date! begin: Int! comment: String! extra_mode: Boolean): CalendarEvent!  @auth_access(role:"edit")
    deleteCalendarEvent(_id: ID!): DeleteResponse! @auth_access(role:"edit")

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
    root: Boolean
    roles: [String]
    calendar_ids: [String]
  }
  type Calendar {
    _id: ID
    archived: Boolean
    location_id: ID
    name: String
    span: Int
    cluster_len: Int
    day_begin: Int
    day_len: Int
    day_offset: Int
    week_days: [Int]
    print_info: String
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
    short_len: Int
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
    any_extra_free: Boolean
    any_event: Boolean
    any_extra: Boolean
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

    serverHash: async (parent, args, context, info) => {
      return git_hash;
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

    calendarEvent: async (parent, { _id } , context, info): Promise<ICalendarEvent> => {
      return await context.dataSources.calendar.getCalendarEvent(_id);
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
    //     calendarEventSearch(search: String! calendar_ids: [ID]! start_date: Date!, end_date: Date!): [CalendarEvent] @auth_access(role:"view")
    calendarEventSearch: async (parent, { search, calendar_ids, start_date, end_date } , context, info): Promise<ICalendarEvent[]> => {
      return await context.dataSources.calendar.searchCalendarEvents(search, calendar_ids, start_date, end_date);
    },


    me: async (parent, args, context, info): Promise<IUser> => {
      return await context.dataSources.user.getMe();
    },
  },
  Mutation: {
    login: async (_, { login, password }, { request_id, user, dataSources }): Promise<ILoginResponse> => {
      A_gql_log(request_id, user, 'login', { login } );
      return dataSources.user.login(login, password);
    },

    relogin: async (_, __, { request_id, user, dataSources }): Promise<ILoginResponse> => {
      A_gql_log(request_id, user, 'relogin');
      return dataSources.user.relogin();
    },

    su: async (_, { login }, { request_id, user, dataSources }): Promise<ILoginResponse> => {
      A_gql_log(request_id, user, 'su', { login } );
      return dataSources.user.su(login);
    },

    updateUser: (_, { login, password, name, root, roles, calendar_ids }, { request_id, user, dataSources }): Promise<IUser> => {
      A_gql_log(request_id, user, 'updateUser', { login, name, root, roles, calendar_ids } );
      return dataSources.user.updateUser(login, password, name, root, roles, calendar_ids);
    },

    createUser: (_, { login, password, name, root, roles, calendar_ids }, { request_id, user, dataSources }): Promise<IUser> => {
      A_gql_log(request_id, user, 'createUser', { login, name, root, roles, calendar_ids } );
      return dataSources.user.createUser(login, password, name, root, roles, calendar_ids);
    },

    updateCalendar: (_, { _id, archived, location_id, name, span, cluster_len, day_begin, day_len, day_offset, week_days, print_info }, { request_id, user, dataSources }): Promise<ICalendar> => {
      A_gql_log(request_id, user, 'updateCalendar', { _id, archived, location_id, name, span, cluster_len, day_begin, day_len, day_offset, week_days, print_info } );
      return dataSources.calendar.updateCalendar(_id, archived, location_id, name, span, cluster_len, day_begin, day_len, day_offset, week_days, print_info);
    },
    createCalendar: (_, { name, location_id, span , cluster_len, day_begin, day_len, day_offset, week_days, print_info}, { request_id, user, dataSources }): Promise<ICalendar> => {
      A_gql_log(request_id, user, 'createCalendar', { location_id, name, span, cluster_len, day_begin, day_offset, day_len, week_days, print_info } );
      return dataSources.calendar.createCalendar(location_id, name, span, cluster_len, day_begin, day_len, day_offset, week_days, print_info);
    },

    updateLocation: (_, { _id, archived, name, address }, { request_id, user, dataSources }): Promise<ILocation> => {
      A_gql_log(request_id, user, 'updateLocation', { _id, archived, name, address } );
      return dataSources.location.updateLocation(_id, archived, name, address);
    },

    createLocation: (_, { name, address }, { request_id, user, dataSources }): Promise<ILocation> => {
      A_gql_log(request_id, user, 'createLocation', { name, address } );
      return dataSources.location.createLocation(name, address);
    },

    createOpeningHoursTemplate: (_, { calendar_id, week_day, begin, len }, { request_id, user, dataSources }): Promise<IOpeningHoursTemplate> => {
      A_gql_log(request_id, user, 'createOpeningHoursTemplate', { calendar_id, week_day, begin, len } );
      return dataSources.calendar.createOHTemplate(calendar_id, week_day, begin, len);
    },

    deleteOpeningHoursTemplate: (_, { _id }, { request_id, user, dataSources }): Promise<IDeleteResponse> => {
      A_gql_log(request_id, user, 'deleteOpeningHoursTemplate', { _id } );
      return dataSources.calendar.deleteOHTemplate(_id);
    },

    createOpeningHours: (_, { calendar_id, day, begin, len }, { request_id, user, dataSources }): Promise<IDayOpeningHours> => {
      A_gql_log(request_id, user, 'createOpeningHours', { calendar_id, day, begin, len } );
      return dataSources.calendar.createOH(calendar_id, day, begin, len);
    },

    planOpeningHours: (_, { calendar_id, start_day, end_day }, { request_id, user, dataSources }): Promise<IDayOpeningHours[]> => {
      A_gql_log(request_id, user, 'planOpeningHours', { calendar_id, start_day, end_day } );
      return dataSources.calendar.planOH(calendar_id, start_day, end_day);
    },

    deleteOpeningHours: (_, { _id }, { request_id, user, dataSources }): Promise<IDeleteResponse> => {
      A_gql_log(request_id, user, 'deleteOpeningHours', { _id } );
      return dataSources.calendar.deleteOH(_id);
    },

    createCalendarEventType: (_, { calendar_id, name, match_key, color, len, short_len, order }, { request_id, user, dataSources }): Promise<ICalendarEventType> => {
      A_gql_log(request_id, user, 'createCalendarEventType', { calendar_id, name, match_key, color, len, short_len, order } );
      return dataSources.calendar.createET(calendar_id, name, match_key, color, len, short_len, order);
    },

    updateCalendarEventType: (_, { _id, name, match_key,  color, len, short_len, order }, { request_id, user, dataSources }): Promise<ICalendarEventType> => {
      A_gql_log(request_id, user, 'updateCalendarEventType', { _id, name, match_key,  color, len, short_len, order } );
      return dataSources.calendar.updateET(_id, name, match_key, color, len, short_len, order);
    },

    deleteCalendarEventType: (_, { _id }, { request_id, user, dataSources }): Promise<IDeleteResponse> => {
      A_gql_log(request_id, user, 'deleteCalendarEventType', { _id } );
      return  dataSources.calendar.deleteET(_id);
    },

    createCalendarEvent: (_, { calendar_id, event_type_id, client, day, begin, comment, extra_mode }, { request_id, user, dataSources }): Promise<ICalendarEvent> => {
      A_gql_log(request_id, user, 'createCalendarEvent', { calendar_id, event_type_id, client, day, begin, comment, extra_mode } );
      return dataSources.calendar.createEvent(calendar_id, event_type_id, client, day, begin, comment, extra_mode);
    },

    updateCalendarEvent: (_, { _id, event_type_id, client, day, begin, comment, extra_mode }, { request_id, user, dataSources }): Promise<ICalendarEvent> => {
      A_gql_log(request_id, user, 'updateCalendarEvent', { _id, event_type_id, client, day, begin, comment, extra_mode } );
      return dataSources.calendar.updateEvent(_id, event_type_id, client, day, begin, comment, extra_mode);
    },

    deleteCalendarEvent: (_, { _id }, { request_id, user, dataSources }): Promise<IDeleteResponse> => {
      A_gql_log(request_id, user, 'deleteCalendarEvent', { _id } );
      return dataSources.calendar.deleteEvent(_id);
    },

  }

};


class AuthAccessDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
      console.error('AuthAccessDirective.visitObject', type);
      // type._requiredRole = this.args.role;
      // this.ensureFieldsWrapped(type);
  }
  visitFieldDefinition(field, details) {
      field._requiredRole = this.args.role;
      const { resolve = defaultFieldResolver } = field;
      const requiredRole = field._requiredRole;
      if (requiredRole) {
        console.log('AccessDirective wrapping ', field.name);
        field.description = `@auth_access role: ${requiredRole}`;
        field.resolve = async function (...args) {
            const context = <IContext> args[2];
            console.log('AuthAccessDirective - check role', requiredRole, 'field', field.name);
            if (! context.user) {
              throw new Error('not authorized');
            }
            if ( !context.user.roles.includes(requiredRole)) {
              throw new Error('access denied');
            }

            return resolve.apply(this, args);
        };
    }
  }

 /*
  ensureFieldsWrapped(objectType) {
      if (objectType._accessFieldsWrapped) {
          return;
      }
      // console.log('ensureFieldsWrapped', objectType);
      objectType._accessFieldsWrapped = true;
      const fields = objectType.getFields();
      Object.keys(fields).forEach(fieldName => {
          const field = fields[fieldName];
          const { resolve = defaultFieldResolver } = field;
          const requiredRole = field._requiredRole || objectType._requiredRole;

          if (requiredRole) {
              console.log('AccessDirective wrapping ', fieldName);
              field.description += `@auth_access role: ${requiredRole}`;
              field.resolve = async function (...args) {
                  const context = <IContext> args[2];
                  console.log('AuthAccessDirective - check role', requiredRole);
                  if (! context.user) {
                    throw new Error('not authorized');
                  }
                  if ( !context.user.roles.includes(requiredRole)) {
                    throw new Error('access denied');
                  }

                  return resolve.apply(this, args);
              };
          }
    });
  }
  */
}



export const schema = makeExecutableSchema<IContext>({
  typeDefs,
  resolvers,
  schemaDirectives: {
            auth_access: AuthAccessDirective,
  },
  allowUndefinedInResolve: false,
  resolverValidationOptions: {
    requireResolversForArgs: true,
  }
});
