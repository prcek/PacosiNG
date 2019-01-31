import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesno'
})
export class YesnoPipe implements PipeTransform {

  transform(value: boolean, args?: any): string {
    switch (value) {
      case true: return 'ano';
      case false: return 'ne';
      default: return '?';
    }
  }

}
