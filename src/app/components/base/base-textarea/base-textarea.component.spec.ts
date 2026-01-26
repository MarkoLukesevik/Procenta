import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTextareaComponent } from './base-textarea.component';

describe('BaseTextareaComponent', () => {
  let component: BaseTextareaComponent;
  let fixture: ComponentFixture<BaseTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
