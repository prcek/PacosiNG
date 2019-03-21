import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDayBoxComponent } from './calendar-day-box.component';

describe('CalendarDayBoxComponent', () => {
  let component: CalendarDayBoxComponent;
  let fixture: ComponentFixture<CalendarDayBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarDayBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDayBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
