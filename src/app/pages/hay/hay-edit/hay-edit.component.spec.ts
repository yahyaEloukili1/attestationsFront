import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HayEditComponent } from './hay-edit.component';

describe('HayEditComponent', () => {
  let component: HayEditComponent;
  let fixture: ComponentFixture<HayEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HayEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HayEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
