import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermsAndConditionsModalComponent } from './terms-and-conditions-modal.component';

describe('TermsAndConditionsModalComponent', () => {
  let component: TermsAndConditionsModalComponent;
  let fixture: ComponentFixture<TermsAndConditionsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
