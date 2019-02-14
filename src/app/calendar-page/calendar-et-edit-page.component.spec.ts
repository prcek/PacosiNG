import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEtEditPageComponent } from './calendar-et-edit-page.component';

describe('CalendarEtEditPageComponent', () => {
  let component: CalendarEtEditPageComponent;
  let fixture: ComponentFixture<CalendarEtEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEtEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEtEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
