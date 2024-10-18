import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitoyensListComponent } from './citoyens-list.component';

describe('CitoyensListComponent', () => {
  let component: CitoyensListComponent;
  let fixture: ComponentFixture<CitoyensListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitoyensListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitoyensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
