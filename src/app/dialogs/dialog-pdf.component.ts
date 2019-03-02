import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogPdfData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.css']
})
export class DialogPdfComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogPdfData
  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
