import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthtipComponent } from './healthtip.component';

describe('HealthtipComponent', () => {
  let component: HealthtipComponent;
  let fixture: ComponentFixture<HealthtipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HealthtipComponent]
    });
    fixture = TestBed.createComponent(HealthtipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
