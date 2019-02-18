import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventsPageComponent } from './calendar-events-page.component';

describe('CalendarEventsPageComponent', () => {
  let component: CalendarEventsPageComponent;
  let fixture: ComponentFixture<CalendarEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
