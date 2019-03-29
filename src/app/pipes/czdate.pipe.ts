import { Pipe, PipeTransform } from '@angular/core';
import { formatDate2String_L, formatDate2String_S, formatDate2String_ISO } from '../utils';

@Pipe({
  name: 'czdate'
})
export class CzdatePipe implements PipeTransform {

  transform(value: Date | string, format?: string): string {
    switch (format) {
      case 'L': return formatDate2String_L(value);
      case 'S': return formatDate2String_S(value);
      case 'I': return formatDate2String_ISO(value);
      default: return formatDate2String_ISO(value);
    } 
  }

}
