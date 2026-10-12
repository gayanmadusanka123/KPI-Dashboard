import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTable } from './kpi-table';

describe('KpiTable', () => {
  let component: KpiTable;
  let fixture: ComponentFixture<KpiTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiTable],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
