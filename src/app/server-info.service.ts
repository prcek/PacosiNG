import { Injectable } from '@angular/core';
import { timer, Observable, Subscriber, Subject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap, switchMap } from 'rxjs/operators';
import * as verdata from './../git-version.json';
const gitver = verdata.default;



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
  public local_version = gitver.hash;

  serverInfoSource = new Subject<IServerInfo>();
  serverInfo: IServerInfo;

  constructor(private apollo: Apollo) {
    this.serverInfo = {
      local_version: this.local_version,
      reload: false,
      online: true,
      remote_version: null,
    };

    this.vtick$.pipe(
      // tap((x) => console.log('version check tick')),
      switchMap(() => this.checkServer()),
    ).subscribe((sv) => {
      // console.log('server version = ', sv);
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

    const x = this.apollo.query<{serverHash: string}>({
      query: gql`query {  serverHash }`
    }).pipe( /*tap((c) => { console.log(c); } ),*/ map(res => res.data.serverHash));


    const ob = Observable.create( (o: Subscriber<string>) => {
      x.subscribe((s) => {
        // console.log('ok path');
        o.next(s);
        o.complete();
      }, (err) => {
        // console.log('err path');
        o.next(null);
        o.complete();
      });
    });
    return ob;
  }

}