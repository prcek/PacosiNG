import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOhtEditorComponent } from './calendar-oht-editor.component';

describe('CalendarOhtEditorComponent', () => {
  let component: CalendarOhtEditorComponent;
  let fixture: ComponentFixture<CalendarOhtEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOhtEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOhtEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
