import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarsPageComponent } from './calendars-page.component';

describe('CalendarsPageComponent', () => {
  let component: CalendarsPageComponent;
  let fixture: ComponentFixture<CalendarsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
