import { Pipe, PipeTransform } from '@angular/core';
import { WeekDayPipe } from './week-day.pipe';

@Pipe({
  name: 'weekDays'
})
export class WeekDaysPipe implements PipeTransform {
  d = new WeekDayPipe();
  transform(value: number[], args?: any): string[] {
    if (value) {
      return value.map((v) => {
        return this.d.transform(v);
      });
    }
    return [];
  }

}
