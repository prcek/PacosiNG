import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionDataService {
  public main_first_day: Date;
  public main_selected_day: Date;

  constructor() {
    console.log('SessionDataService.constructor');
  }

}
