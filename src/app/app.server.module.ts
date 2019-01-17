import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TEST_TOKEN } from './token';
import { GraphQLServerModule } from './graphql.server.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    GraphQLServerModule,
  ],
  providers: [{
    provide: TEST_TOKEN, useValue: 'sss'
  }],
  bootstrap: [AppComponent]
})
export class AppServerModule { }
