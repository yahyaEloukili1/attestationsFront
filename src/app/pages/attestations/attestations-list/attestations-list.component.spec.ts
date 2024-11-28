import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationsListComponent } from './attestations-list.component';

describe('AttestationsListComponent', () => {
  let component: AttestationsListComponent;
  let fixture: ComponentFixture<AttestationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttestationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttestationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
