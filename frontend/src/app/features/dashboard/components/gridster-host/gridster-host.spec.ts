import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsterHost } from './gridster-host';

describe('GridsterHost', () => {
  let component: GridsterHost;
  let fixture: ComponentFixture<GridsterHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridsterHost],
    }).compileComponents();

    fixture = TestBed.createComponent(GridsterHost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
