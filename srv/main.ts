import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as responseTime from 'response-time';
import {join} from 'path';


import {createAndRegisterApolloServer} from './apollo';

const DIST_FOLDER = join(process.cwd(), 'dist/pacosi');


(async () => {

    const app = express();
    const PORT = process.env.PORT || 4000;

    app.set('view engine', 'html');
    app.set('views', DIST_FOLDER);
    app.use(responseTime());
    app.use(cookieParser());
    app.get('*.*', express.static(DIST_FOLDER, {
      maxAge: '1y'
    }));

    await createAndRegisterApolloServer(app);

    app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
    });
  })().catch(e => {
    console.error('global error', e);
  });








