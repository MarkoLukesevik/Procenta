import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseNumberInputComponent } from './base-number-input.component';

describe('BaseNumberInputComponent', () => {
  let component: BaseNumberInputComponent;
  let fixture: ComponentFixture<BaseNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseNumberInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
