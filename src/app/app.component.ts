import { Component, Inject, Optional } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { TEST_TOKEN } from './token';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pacosi';
  constructor(@Optional() @Inject(APP_BASE_HREF) app_base_href: string, @Optional() @Inject(TEST_TOKEN) test_token: string ) {
    console.log('AppComponent.constructor', app_base_href, test_token);
  }
}
