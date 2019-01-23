import {NgModule, Injector} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import { HttpHeaders } from '@angular/common/http';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here
export function createApolloServer(httpLink: HttpLink, injector: Injector, req: Request ) {
  // console.log('SERVER createApollo Options', injector);
  // injector.get()

  let auth = null;
  if (req.cookies && req.cookies.auth) {
    auth = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer ' + req.cookies.auth
        ),
      });
      return forward(operation);
    });
  }

  const http = httpLink.create({uri});
  return {
    link: auth ? auth.concat(http) : http,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApolloServer,
      deps: [HttpLink, Injector, REQUEST],
    },
  ],
})
export class GraphQLServerModule {}
