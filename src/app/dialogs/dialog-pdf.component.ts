import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PdfService } from '../pdf.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface DialogPdfData {
  title: string;
  doc: object;
}

@Component({
  selector: 'app-dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.css']
})
export class DialogPdfComponent implements OnInit {
  safedataurl: SafeResourceUrl;
  constructor(
    public dialogRef: MatDialogRef<DialogPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogPdfData,
    private sanitizer: DomSanitizer,
    private pdf: PdfService
  ) { }

  ngOnInit() {
    this.pdf.render(this.data.doc).subscribe(r => {
      this.safedataurl = this.sanitizer.bypassSecurityTrustResourceUrl(r.data);
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
