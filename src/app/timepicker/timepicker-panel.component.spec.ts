import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerPanelComponent } from './timepicker-panel.component';

describe('TimepickerPanelComponent', () => {
  let component: TimepickerPanelComponent;
  let fixture: ComponentFixture<TimepickerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepickerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
