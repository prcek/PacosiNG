import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfService } from '../pdf.service';

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
