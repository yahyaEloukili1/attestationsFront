import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaayouneComponent } from './laayoune.component';

describe('LaayouneComponent', () => {
  let component: LaayouneComponent;
  let fixture: ComponentFixture<LaayouneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaayouneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaayouneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
