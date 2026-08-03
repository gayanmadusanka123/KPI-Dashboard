import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiManagement } from './kpi-management';

describe('KpiManagement', () => {
  let component: KpiManagement;
  let fixture: ComponentFixture<KpiManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
