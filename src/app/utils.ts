

import * as M from 'moment';
const sdayNames = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
// tslint:disable-next-line:max-line-length
const smonthNames = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];



export function formatDate2String_L(value: Date | string) {
    if (value) {
        const date = (value instanceof Date) ? value : M.utc(value).toDate();
        return dayNames[date.getDay()] + ' ' + date.getDate() + '. ' + smonthNames[date.getMonth()] + ' ' + date.getFullYear();
    }
    return '?';
}


export function formatDate2String_S(value: Date | string) {
    if (value) {
        const date = (value instanceof Date) ? value : M.utc(value).toDate();
        return date.getDate() + '. ' + smonthNames[date.getMonth()] + ' ' + date.getFullYear();
    }
    return '?';
}


export function formatDate2String_ISO(value: Date | string) {
    if (value) {
        const date = (value instanceof Date) ? value : M.utc(value).toDate();
        return M(date).utc().toISOString();
    }
    return '?';
}


export function safeString(value: string | null): string {
    if (value) {
        return value;
    }
    return '';
}

export function safeNumber2String(value: number | null): string {
    if (isNaN(value) || value === null) {
        return '';
    }
    return '' + value;
}
