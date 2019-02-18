import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventNewPageComponent } from './calendar-event-new-page.component';

describe('CalendarEventNewPageComponent', () => {
  let component: CalendarEventNewPageComponent;
  let fixture: ComponentFixture<CalendarEventNewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventNewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
