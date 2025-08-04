import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LokalsSliderComponent } from './lokals-slider.component';

describe('LokalsSliderComponent', () => {
  let component: LokalsSliderComponent;
  let fixture: ComponentFixture<LokalsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LokalsSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LokalsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
