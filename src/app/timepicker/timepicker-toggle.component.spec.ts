import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerToggleComponent } from './timepicker-toggle.component';

describe('TimepickerToggleComponent', () => {
  let component: TimepickerToggleComponent;
  let fixture: ComponentFixture<TimepickerToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepickerToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
