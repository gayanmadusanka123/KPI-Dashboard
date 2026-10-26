import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastOverview } from './forecast-overview';

describe('ForecastOverview', () => {
  let component: ForecastOverview;
  let fixture: ComponentFixture<ForecastOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
