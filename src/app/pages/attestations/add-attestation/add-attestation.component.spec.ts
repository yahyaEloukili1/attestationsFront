import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttestationComponent } from './add-attestation.component';

describe('AddAttestationComponent', () => {
  let component: AddAttestationComponent;
  let fixture: ComponentFixture<AddAttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
