import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHommesAutoritesComponent } from './add-hommes-autorites.component';

describe('AddHommesAutoritesComponent', () => {
  let component: AddHommesAutoritesComponent;
  let fixture: ComponentFixture<AddHommesAutoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHommesAutoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHommesAutoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
