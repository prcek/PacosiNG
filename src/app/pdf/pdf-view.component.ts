import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfService } from '../pdf.service';
assign(pdfMake, 'vfs', pdfFonts.pdfMake.vfs);

function assign(obj: any, prop: any, value: any) {
  if (typeof prop === 'string') {
    prop = prop.split('.');
  }

  if (prop.length > 1) {
    const e = prop.shift();
    this.assign(obj[e] =
      Object.prototype.toString.call(obj[e]) === '[object Object]'
        ? obj[e]
        : {},
      prop,
      value);
  } else {
    obj[prop[0]] = value;
  }
}

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css']
})
export class PdfViewComponent implements OnInit {
  urldata: string;
  safeurl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer, private pdf: PdfService) {

  }

  ngOnInit() {
    const dd = {
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 100, '*' ],
            body: [
              [ 'First', 'Second', 'Third', 'The last one' ],
              [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
              [ { text: 'Bold value ěščřžžýýáň', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
            ]
          }
        }
      ]
    };
    this.pdf.render(dd).subscribe(r => {
      this.urldata = r.data;
      this.safeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.urldata);
    });
    // pdfMake.createPdf(dd).download();
    /*
    const pdfDocGenerator = <any> pdfMake.createPdf(dd);
    pdfDocGenerator.getDataUrl((url) => {
      // console.log('url:', url);
      this.urldata = url;
      this.safeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.urldata);
      // console.log('url:', this.safeurl);
    });
    */
  }

}
