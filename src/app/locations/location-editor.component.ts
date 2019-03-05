import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ILocation, LocationService } from '../location.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-editor',
  templateUrl: './location-editor.component.html',
  styleUrls: ['./location-editor.component.css']
})
export class LocationEditorComponent implements OnInit {
  @Output() saved = new EventEmitter<ILocation>();
  @Input() loc: ILocation;
  @Input() new_mode: boolean;


  locForm = new FormGroup({
    name: new FormControl('', { validators: Validators.required}),
    address: new FormControl('', { validators: Validators.required}),
    archived: new FormControl(false),
  });
  error_msg: string;
  submitted = false;

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    console.log('LocationEditorComponent.ngOnInit', this.loc, this.new_mode);
    if (this.new_mode) {

    } else {
      this.locForm.setValue({
        name: this.loc.name,
        address: this.loc.address,
        archived: this.loc.archived,
      });
    }
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    if (this.new_mode) {
     const nc: ILocation = {_id: null, ...this.locForm.getRawValue()};
     this.submitted = true;
     this.locForm.disable();
     this.error_msg = null;
     console.log('LocationEditorComponent.onSubmit (newmode)', nc);
     this.locationService.createLocation(nc).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       this.locForm.enable();
     }, (err) => {
       this.submitted = false;
       this.locForm.enable();
       this.error_msg = err;
     });
    } else {
     const uc: ILocation = {_id: this.loc._id, ...this.locForm.getRawValue()};
     this.submitted = true;
     this.locForm.disable();
     this.error_msg = null;
     console.log('LocationEditorComponent.onSubmit', uc);
     this.locationService.updateLocation(uc).subscribe((r) => {
       this.saved.emit(r);
       this.submitted = false;
       this.locForm.enable();
     }, (err) => {
       this.submitted = false;
       this.locForm.enable();
       this.error_msg = err;
     });
    }
 }

}
