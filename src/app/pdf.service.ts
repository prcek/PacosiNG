import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const uri = '/pdf';

export interface PDF {
  ok: boolean;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) { }
  render(doc: object): Observable<PDF> {
    return this.http.post<PDF>(uri, {doc});
  }
}
