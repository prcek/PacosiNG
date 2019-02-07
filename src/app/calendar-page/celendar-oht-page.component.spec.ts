import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CelendarOhtPageComponent } from './celendar-oht-page.component';

describe('CelendarOhtPageComponent', () => {
  let component: CelendarOhtPageComponent;
  let fixture: ComponentFixture<CelendarOhtPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CelendarOhtPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CelendarOhtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
