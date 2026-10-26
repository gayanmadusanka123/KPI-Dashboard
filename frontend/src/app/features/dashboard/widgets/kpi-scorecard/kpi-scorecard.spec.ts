import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScorecard } from './kpi-scorecard';

describe('KpiScorecard', () => {
  let component: KpiScorecard;
  let fixture: ComponentFixture<KpiScorecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiScorecard],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiScorecard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
