import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent } from '../dialogs/dialog-confirm.component';
import { PdfService } from '../pdf.service';
import { DialogPdfComponent } from '../dialogs/dialog-pdf.component';


const DD = {
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
          [ { text: 'Dialog Bold value ěščřžžýýáň', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
        ]
      }
    }
  ]
};

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

  form = {
    date: '',
    time: 5,
    time2: 10
  };
  submitted = false;
  disabled = false;
  now = new Date();
  constructor(public dialog: MatDialog, private pdf: PdfService) { }

  ngOnInit() {
  }
  onSubmit() {}
  onTest() {
    this.disabled = !this.disabled;
  }
  onTest2() {
    const dialogRef = this.dialog.open(DialogPdfComponent, {
      width: '100vw',
      height: '100vh',
      maxHeight: 'none',
      maxWidth: 'none',
      data: {title: 'titulek', doc: DD}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  get diagnostic() { return JSON.stringify({form: this.form, disabled: this.disabled }); }


}
