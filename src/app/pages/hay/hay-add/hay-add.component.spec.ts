import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HayAddComponent } from './hay-add.component';

describe('HayAddComponent', () => {
  let component: HayAddComponent;
  let fixture: ComponentFixture<HayAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HayAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
