import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaypickerPanelComponent } from './daypicker-panel.component';

describe('DaypickerPanelComponent', () => {
  let component: DaypickerPanelComponent;
  let fixture: ComponentFixture<DaypickerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaypickerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaypickerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
