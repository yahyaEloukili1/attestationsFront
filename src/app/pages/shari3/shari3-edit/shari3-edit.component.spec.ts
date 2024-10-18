import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shari3EditComponent } from './shari3-edit.component';

describe('Shari3EditComponent', () => {
  let component: Shari3EditComponent;
  let fixture: ComponentFixture<Shari3EditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shari3EditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Shari3EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
