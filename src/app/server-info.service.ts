import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { timer, Observable, Subscriber, Subject, interval, race } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap, switchMap, mapTo, timeout } from 'rxjs/operators';

import { git_hash } from './../git-version';
import { isPlatformServer } from '@angular/common';


export interface IServerInfo {
  online: boolean;
  remote_version: string;
  local_version: string;
  reload: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServerInfoService {
  private vtick$ = timer(2000, 10000);
  public local_version = git_hash;

  serverInfoSource = new Subject<IServerInfo>();
  serverInfo: IServerInfo;

  constructor(private apollo: Apollo, @Inject(PLATFORM_ID) platformId) {
    console.log('ServerInfoService.constructor', git_hash);
    this.serverInfo = {
      local_version: this.local_version,
      reload: false,
      online: true,
      remote_version: null,
    };

    if (isPlatformServer(platformId)) {
      return;
    }

    this.vtick$.pipe(
      tap((x) => console.log('version check tick')),
      switchMap(() => this.checkServer()),
    ).subscribe((sv) => {
      console.log('server version = ', sv);
      if (sv) {
        this.serverInfo.online = true;
        this.serverInfo.remote_version = sv;
        if (this.serverInfo.remote_version !== this.serverInfo.local_version) {
          this.serverInfo.reload = true;
          console.log('new version available', sv);
        } else {
          this.serverInfo.reload = false;
        }
        this.serverInfoSource.next(this.serverInfo);
      } else {
        console.log('server is offline');
        this.serverInfo.online = false;
        this.serverInfoSource.next(this.serverInfo);
      }
    });
  }


  checkServer(): Observable<string> {
    console.log('new checkServer');
    const x = this.apollo.query<{serverHash: string}>({
      query: gql`query {  serverHash }`
    }).pipe( timeout(5000), tap((c) => { console.log('check server', c); } ), map(res => res.data.serverHash));
    // const to = interval(5000).pipe( tap((c) => { console.log('timeout tick'); }), mapTo(null));

    const ob = Observable.create( (o: Subscriber<string>) => {
      x.subscribe((s) => {
        console.log('ok path', s);
        o.next(s);
        o.complete();
      }, (err) => {
        console.log('err path');
        o.next(null);
        o.complete();
      });
    });
    return ob;
  }

}
