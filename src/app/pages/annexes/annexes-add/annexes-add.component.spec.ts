import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesAddComponent } from './annexes-add.component';

describe('AnnexesAddComponent', () => {
  let component: AnnexesAddComponent;
  let fixture: ComponentFixture<AnnexesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnexesAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnexesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
