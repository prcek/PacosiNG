import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOhEditorComponent } from './calendar-oh-editor.component';

describe('CalendarOhEditorComponent', () => {
  let component: CalendarOhEditorComponent;
  let fixture: ComponentFixture<CalendarOhEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOhEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOhEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
