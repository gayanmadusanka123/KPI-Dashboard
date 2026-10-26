import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDonut } from './performance-donut';

describe('PerformanceDonut', () => {
  let component: PerformanceDonut;
  let fixture: ComponentFixture<PerformanceDonut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceDonut],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceDonut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
