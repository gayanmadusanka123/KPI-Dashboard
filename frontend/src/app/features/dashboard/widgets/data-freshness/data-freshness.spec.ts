import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFreshness } from './data-freshness';

describe('DataFreshness', () => {
  let component: DataFreshness;
  let fixture: ComponentFixture<DataFreshness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFreshness],
    }).compileComponents();

    fixture = TestBed.createComponent(DataFreshness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
