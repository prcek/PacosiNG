import { Pipe, PipeTransform } from '@angular/core';

const DAYS = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So' ];

@Pipe({
  name: 'weekDay'
})

export class WeekDayPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    if ((value >= 0) && (value < DAYS.length)) {
      return DAYS[value];
    }
    return value + '?';
  }

}
