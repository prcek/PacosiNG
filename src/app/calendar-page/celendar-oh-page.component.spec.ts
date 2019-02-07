import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CelendarOhPageComponent } from './celendar-oh-page.component';

describe('CelendarOhPageComponent', () => {
  let component: CelendarOhPageComponent;
  let fixture: ComponentFixture<CelendarOhPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CelendarOhPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CelendarOhPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
