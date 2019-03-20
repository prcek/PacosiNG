import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventSearchPageComponent } from './calendar-event-search-page.component';

describe('CalendarEventSearchPageComponent', () => {
  let component: CalendarEventSearchPageComponent;
  let fixture: ComponentFixture<CalendarEventSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
