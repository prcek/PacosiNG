import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as data from './git-version.json';

const git = data.default;
if (environment.production) {
  enableProdMode();
}
console.log('GIT_HASH', git.hash);

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
