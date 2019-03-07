import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventChipComponent } from './calendar-event-chip.component';

describe('CalendarEventChipComponent', () => {
  let component: CalendarEventChipComponent;
  let fixture: ComponentFixture<CalendarEventChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
