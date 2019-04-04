import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastWarningComponent } from './past-warning.component';

describe('PastWarningComponent', () => {
  let component: PastWarningComponent;
  let fixture: ComponentFixture<PastWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
