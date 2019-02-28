import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent } from '../dialogs/dialog-confirm.component';
import { PdfService } from '../pdf.service';

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
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '250px',
      data: {title: 'titulek', content: 'content text'}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  get diagnostic() { return JSON.stringify({form: this.form, disabled: this.disabled }); }


}
