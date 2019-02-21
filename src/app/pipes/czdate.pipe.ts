import { Pipe, PipeTransform } from '@angular/core';
import * as M from 'moment';
const sdayNames = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Streda', 'Čtvrtek', 'Pátek', 'Sobota'];
const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
// tslint:disable-next-line:max-line-length
const smonthNames = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

@Pipe({
  name: 'czdate'
})
export class CzdatePipe implements PipeTransform {

  transform(date: Date, args?: any): string {
    if (date) {
        return dayNames[date.getDay()] + ' ' + date.getDate() + '. ' + smonthNames[date.getMonth()] + ' ' + date.getFullYear();
    }
    return '<missing date value>';
  }

}
