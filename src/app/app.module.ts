import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TEST_TOKEN } from './token';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    AppRoutingModule
  ],
  providers: [ /*{
    provide: TEST_TOKEN, useValue: 'cli value'
  }*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
