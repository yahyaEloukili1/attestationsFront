import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitoyensEditComponent } from './citoyens-edit.component';

describe('CitoyensEditComponent', () => {
  let component: CitoyensEditComponent;
  let fixture: ComponentFixture<CitoyensEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitoyensEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitoyensEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
