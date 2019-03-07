import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarChipComponent } from './calendar-chip.component';

describe('CalendarChipComponent', () => {
  let component: CalendarChipComponent;
  let fixture: ComponentFixture<CalendarChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
