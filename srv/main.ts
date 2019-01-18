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

enableProdMode();

const DIST_FOLDER = join(process.cwd(), 'dist/pacosi');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, TEST_TOKEN } = require('../ssr/main');
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();
console.log('testtoken', TEST_TOKEN);

(async () => {

    const app = express();
    const PORT = process.env.PORT || 4000;



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

    app.set('view engine', 'html');
    app.set('views', DIST_FOLDER);
    app.use(responseTime());
    app.use(cookieParser());
    app.get('*.*', express.static(DIST_FOLDER, {
      maxAge: '1y'
    }));

    await createAndRegisterApolloServer(app);

    app.get('*', (req, res) => {
      console.log('main get *');
      res.render(join(DIST_FOLDER, 'index.html'), { req });
    });

    app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
    });
  })().catch(e => {
    console.error('global error', e);
  });








