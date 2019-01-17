import { InjectionToken, Injectable } from '@angular/core';

export const TEST_TOKEN = new InjectionToken<string>('test_token', { providedIn: 'root', factory: () => 'x'});

/*
@Injectable({
    providedIn: 'root',
  })
export class HeroService {
    constructor() { }
}
*/
