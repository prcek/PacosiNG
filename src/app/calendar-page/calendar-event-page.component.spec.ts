import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventPageComponent } from './calendar-event-page.component';

describe('CalendarEventPageComponent', () => {
  let component: CalendarEventPageComponent;
  let fixture: ComponentFixture<CalendarEventPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
