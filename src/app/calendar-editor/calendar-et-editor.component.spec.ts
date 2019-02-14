import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEtEditorComponent } from './calendar-et-editor.component';

describe('CalendarEtEditorComponent', () => {
  let component: CalendarEtEditorComponent;
  let fixture: ComponentFixture<CalendarEtEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEtEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEtEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
