import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarNewPageComponent } from './calendar-new-page.component';

describe('CalendarNewPageComponent', () => {
  let component: CalendarNewPageComponent;
  let fixture: ComponentFixture<CalendarNewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarNewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
