import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoucraaComponent } from './boucraa.component';

describe('BoucraaComponent', () => {
  let component: BoucraaComponent;
  let fixture: ComponentFixture<BoucraaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoucraaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoucraaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
