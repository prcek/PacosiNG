import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventClipComponent } from './calendar-event-clip.component';

describe('CalendarEventClipComponent', () => {
  let component: CalendarEventClipComponent;
  let fixture: ComponentFixture<CalendarEventClipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventClipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventClipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
