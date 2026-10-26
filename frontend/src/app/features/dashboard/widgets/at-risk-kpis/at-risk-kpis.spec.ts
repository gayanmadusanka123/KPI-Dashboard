import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtRiskKpis } from './at-risk-kpis';

describe('AtRiskKpis', () => {
  let component: AtRiskKpis;
  let fixture: ComponentFixture<AtRiskKpis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtRiskKpis],
    }).compileComponents();

    fixture = TestBed.createComponent(AtRiskKpis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
