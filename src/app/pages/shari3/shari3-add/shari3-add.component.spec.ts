import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shari3AddComponent } from './shari3-add.component';

describe('Shari3AddComponent', () => {
  let component: Shari3AddComponent;
  let fixture: ComponentFixture<Shari3AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shari3AddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Shari3AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
