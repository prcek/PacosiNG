import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNewPageComponent } from './location-new-page.component';

describe('LocationNewPageComponent', () => {
  let component: LocationNewPageComponent;
  let fixture: ComponentFixture<LocationNewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationNewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
