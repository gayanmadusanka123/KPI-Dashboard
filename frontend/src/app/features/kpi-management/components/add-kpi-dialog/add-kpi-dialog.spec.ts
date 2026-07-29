import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKpiDialog } from './add-kpi-dialog';

describe('AddKpiDialog', () => {
  let component: AddKpiDialog;
  let fixture: ComponentFixture<AddKpiDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddKpiDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddKpiDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
