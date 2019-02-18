import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventEditorComponent } from './calendar-event-editor.component';

describe('CalendarEventEditorComponent', () => {
  let component: CalendarEventEditorComponent;
  let fixture: ComponentFixture<CalendarEventEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
