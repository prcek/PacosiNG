import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';


import {createAndRegisterApolloServer} from './apollo';



(async () => {
    
    const app = express();
    const PORT = process.env.PORT || 4000;
    
    app.use(cookieParser());

    await createAndRegisterApolloServer(app);

    app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
    });
  })().catch(e => {
    console.error('global error',e);
  });
  







