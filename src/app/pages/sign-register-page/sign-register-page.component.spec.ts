import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignRegisterPageComponent } from './sign-register-page.component';

describe('SignRegisterPageComponent', () => {
  let component: SignRegisterPageComponent;
  let fixture: ComponentFixture<SignRegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignRegisterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
