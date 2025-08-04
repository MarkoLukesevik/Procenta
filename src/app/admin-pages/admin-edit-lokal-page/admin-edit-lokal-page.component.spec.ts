import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditLokalPageComponent } from './admin-edit-lokal-page.component';

describe('AdminEditLokalPageComponent', () => {
  let component: AdminEditLokalPageComponent;
  let fixture: ComponentFixture<AdminEditLokalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditLokalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditLokalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
