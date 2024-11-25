import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationsEditComponent } from './attestations-edit.component';

describe('AttestationsEditComponent', () => {
  let component: AttestationsEditComponent;
  let fixture: ComponentFixture<AttestationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttestationsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttestationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
