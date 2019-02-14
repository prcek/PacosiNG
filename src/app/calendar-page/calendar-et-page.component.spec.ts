import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEtPageComponent } from './calendar-et-page.component';

describe('CalendarEtPageComponent', () => {
  let component: CalendarEtPageComponent;
  let fixture: ComponentFixture<CalendarEtPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEtPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
