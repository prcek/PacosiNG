import { Component, Inject, Optional, OnDestroy, OnInit } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { TEST_TOKEN } from './token';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

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
  private querySubscription: Subscription;
  constructor(
      @Optional() @Inject(APP_BASE_HREF) app_base_href: string,
      @Optional() @Inject(TEST_TOKEN) test_token: string,
      private apollo: Apollo,
      ) {
    console.log('AppComponent.constructor', app_base_href, test_token);
  }
  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: getHello
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.hello = data.hello;
      });
  }
  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

}
