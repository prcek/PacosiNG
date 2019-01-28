import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as responseTime from 'response-time';
import { join } from 'path';
import { readFileSync } from 'fs';

import {createAndRegisterApolloServer} from './apollo';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode, InjectionToken } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import {ngExpressEngine} from '@nguniversal/express-engine';
import { config } from './config';
import { decodeAuthToken } from './datasources/user';

if (config.is_production) {
  enableProdMode();
}

const DIST_FOLDER = join(process.cwd(), 'dist/pacosi');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, TEST_TOKEN, AUTH_USER_INFO_TOKEN } = require('../ssr/main');
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();
console.log('testtoken', TEST_TOKEN);

(async () => {

    const app = express();
    const PORT = process.env.PORT || 4000;

    app.engine('html', ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [
        provideModuleMap(LAZY_MODULE_MAP),
        { provide: APP_BASE_HREF, useValue: config.app_url_base},
        { provide: TEST_TOKEN, useValue: 'tttt'}
      ]
    }));
/*
    app.engine('html', (_, options, callback) => {
      console.log('renderModuleFactory start');
      renderModuleFactory(AppServerModuleNgFactory, {
        // Our index.html
        document: template,
        url: options.req.url,
        // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
        extraProviders: [
          provideModuleMap(LAZY_MODULE_MAP),
          { provide: APP_BASE_HREF, useValue: 'pepa'},
          { provide: TEST_TOKEN, useValue: 'tttt'}
        ]
      }).then(html => {
        console.log('renderModuleFactory done');
        callback(null, html);
      });
    });
*/
    app.set('view engine', 'html');
    app.set('views', DIST_FOLDER);
    app.use(responseTime());
    app.use(cookieParser());
    app.get('*.*', express.static(DIST_FOLDER, {
      maxAge: '1y'
    }));

    await createAndRegisterApolloServer(app, config.is_production);

    app.get('*', (req, res) => {
      console.log('main get *');
      let aui = null;
      if (req.cookies && req.cookies.auth) {
        const user = decodeAuthToken(req.cookies.auth);
        if (user) {
          aui = { login: user.login, sudo: user.sudo, roles: user.roles };
        }
      }
      res.render(join(DIST_FOLDER, 'index.html'), {
        req ,
        res ,
        providers: [
          {
            provide: REQUEST, useValue: (req)
          },
          {
            provide: RESPONSE, useValue: (res)
          },
          {
            provide: AUTH_USER_INFO_TOKEN, useValue: (aui)
          }
        ]
      });
    });

    app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
    });
  })().catch(e => {
    console.error('global error', e);
  });








