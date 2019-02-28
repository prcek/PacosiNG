import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busyfree'
})
export class BusyfreePipe implements PipeTransform {

  transform(value: boolean, args?: any): string {
    switch (value) {
      case true: return 'obsazeno';
      case false: return 'volno';
      default: return '?';
    }
  }

}
