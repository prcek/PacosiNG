import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as LogRocket from 'logrocket';

if (environment.production) {
  enableProdMode();
  LogRocket.init('evmn92/den-doktora');
}

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
