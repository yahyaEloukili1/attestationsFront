import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoumelouadComponent } from './foumelouad.component';

describe('FoumelouadComponent', () => {
  let component: FoumelouadComponent;
  let fixture: ComponentFixture<FoumelouadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoumelouadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoumelouadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
