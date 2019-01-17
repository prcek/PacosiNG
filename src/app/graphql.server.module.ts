import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here
export function createApolloServer(httpLink: HttpLink) {
  console.log('SERVER createApollo Options');
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApolloServer,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLServerModule {}
