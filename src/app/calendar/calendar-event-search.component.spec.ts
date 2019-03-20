import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventSearchComponent } from './calendar-event-search.component';

describe('CalendarEventSearchComponent', () => {
  let component: CalendarEventSearchComponent;
  let fixture: ComponentFixture<CalendarEventSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
