import { Component, Inject, Optional, OnDestroy, OnInit, PLATFORM_ID, APP_ID } from '@angular/core';
import {APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { TEST_TOKEN } from './token';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';


const HELLO_KEY = makeStateKey<string>('hello');

const getHello = gql`
  query {
    hello
  }
`;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pacosi';
  hello = '?';
  private isServer: boolean;
  private querySubscription: Subscription;
  constructor(
      @Optional() @Inject(APP_BASE_HREF) app_base_href: string,
      @Optional() @Inject(TEST_TOKEN) test_token: string,
      @Inject(PLATFORM_ID) platformId,
      @Inject(APP_ID) appID,
      private tstate: TransferState,
      private apollo: Apollo,
      ) {
    this.isServer = isPlatformServer(platformId);
    console.log('AppComponent.constructor', app_base_href, test_token, this.isServer, appID);
  }
  ngOnInit(): void {
    if (this.tstate.hasKey(HELLO_KEY)) {
      console.log('transferstate client');
      this.hello = this.tstate.get(HELLO_KEY, '!');
      this.tstate.remove(HELLO_KEY);
    }
    this.querySubscription = this.apollo.watchQuery<any>({
      query: getHello
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.hello = data.hello;
      });
    if (this.isServer) {
      this.tstate.onSerialize(HELLO_KEY, () => this.hello);
    }
  }
  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

}
