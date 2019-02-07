import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOhtPageComponent } from './calendar-oht-page.component';

describe('CelendarOhtPageComponent', () => {
  let component: CalendarOhtPageComponent;
  let fixture: ComponentFixture<CalendarOhtPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOhtPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOhtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
