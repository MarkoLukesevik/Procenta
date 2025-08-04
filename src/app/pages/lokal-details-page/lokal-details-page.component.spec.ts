import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LokalDetailsPageComponent } from './lokal-details-page.component';

describe('RestaurantDetailsPageComponent', () => {
  let component: LokalDetailsPageComponent;
  let fixture: ComponentFixture<LokalDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LokalDetailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LokalDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
