import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBottomPerformers } from './top-bottom-performers';

describe('TopBottomPerformers', () => {
  let component: TopBottomPerformers;
  let fixture: ComponentFixture<TopBottomPerformers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBottomPerformers],
    }).compileComponents();

    fixture = TestBed.createComponent(TopBottomPerformers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
