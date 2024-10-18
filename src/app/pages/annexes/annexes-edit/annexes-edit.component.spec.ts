import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesEditComponent } from './annexes-edit.component';

describe('AnnexesEditComponent', () => {
  let component: AnnexesEditComponent;
  let fixture: ComponentFixture<AnnexesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnexesEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnexesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
