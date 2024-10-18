import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitoyensAddComponent } from './citoyens-add.component';

describe('CitoyensAddComponent', () => {
  let component: CitoyensAddComponent;
  let fixture: ComponentFixture<CitoyensAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitoyensAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitoyensAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
