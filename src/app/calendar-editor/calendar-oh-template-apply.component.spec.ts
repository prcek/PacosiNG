import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOhTemplateApplyComponent } from './calendar-oh-template-apply.component';

describe('CalendarOhTemplateApplyComponent', () => {
  let component: CalendarOhTemplateApplyComponent;
  let fixture: ComponentFixture<CalendarOhTemplateApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOhTemplateApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOhTemplateApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
