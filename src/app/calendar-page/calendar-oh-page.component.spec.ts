import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOhPageComponent } from './calendar-oh-page.component';

describe('CelendarOhPageComponent', () => {
  let component: CalendarOhPageComponent;
  let fixture: ComponentFixture<CalendarOhPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOhPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOhPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
