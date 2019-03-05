import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventPastePageComponent } from './calendar-event-paste-page.component';

describe('CalendarEventPastePageComponent', () => {
  let component: CalendarEventPastePageComponent;
  let fixture: ComponentFixture<CalendarEventPastePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventPastePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventPastePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
