import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shari3ListComponent } from './shari3-list.component';

describe('Shari3ListComponent', () => {
  let component: Shari3ListComponent;
  let fixture: ComponentFixture<Shari3ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shari3ListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Shari3ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
