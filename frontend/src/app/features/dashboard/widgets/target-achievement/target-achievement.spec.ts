import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAchievement } from './target-achievement';

describe('TargetAchievement', () => {
  let component: TargetAchievement;
  let fixture: ComponentFixture<TargetAchievement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetAchievement],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetAchievement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
