import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tstime'
})
export class TstimePipe implements PipeTransform {

  transform(value: number, span: number, offset?: number): string {
    const t = span * (value + (offset ? offset : 0));
    const m = t % 60;
    const h =  (t - m) / 60;
    const H = h.toString().padStart(2, '0');
    const M = m.toString().padStart(2, '0');
    return H + ':' + M;
  }

}
