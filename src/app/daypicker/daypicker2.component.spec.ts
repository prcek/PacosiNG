import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Daypicker2Component } from './daypicker2.component';

describe('Daypicker2Component', () => {
  let component: Daypicker2Component;
  let fixture: ComponentFixture<Daypicker2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Daypicker2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Daypicker2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
