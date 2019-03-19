import { Component, Inject, Optional, OnDestroy, OnInit, PLATFORM_ID, APP_ID } from '@angular/core';
import {APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { TEST_TOKEN } from './token';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { IServerInfo, ServerInfoService } from './server-info.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pacosi';
  private isServer: boolean;
  private sinfoSub: Subscription;
  private sinfo: IServerInfo;
  constructor(
      @Optional() @Inject(APP_BASE_HREF) app_base_href: string,
      @Optional() @Inject(TEST_TOKEN) test_token: string,
      @Inject(PLATFORM_ID) platformId,
      @Inject(APP_ID) appID,
      private serverInfo: ServerInfoService
      ) {
    this.isServer = isPlatformServer(platformId);
    console.log('AppComponent.constructor', app_base_href, test_token, this.isServer, appID);
  }
  ngOnInit(): void {

    this.sinfo = this.serverInfo.serverInfo;
    this.sinfoSub = this.serverInfo.serverInfoSource.subscribe({
      next: (v) => { this.sinfo = v; console.log('new server info', v); }
    });


  }
  ngOnDestroy(): void {
    this.sinfoSub.unsubscribe();
  }

}
