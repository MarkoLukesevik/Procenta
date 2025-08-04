import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LokalCardComponent } from './lokal-card.component';

describe('LokalCardComponent', () => {
  let component: LokalCardComponent;
  let fixture: ComponentFixture<LokalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LokalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LokalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
