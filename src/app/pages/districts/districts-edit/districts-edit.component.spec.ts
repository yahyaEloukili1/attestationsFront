import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictsEditComponent } from './districts-edit.component';

describe('DistrictsEditComponent', () => {
  let component: DistrictsEditComponent;
  let fixture: ComponentFixture<DistrictsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistrictsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
