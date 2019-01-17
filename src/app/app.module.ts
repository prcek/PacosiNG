import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TEST_TOKEN } from './token';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule
  ],
  providers: [ /*{
    provide: TEST_TOKEN, useValue: 'cli value'
  }*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
