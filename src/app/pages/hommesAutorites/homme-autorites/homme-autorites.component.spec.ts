import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HommeAutoritesComponent } from './homme-autorites.component';

describe('HommeAutoritesComponent', () => {
  let component: HommeAutoritesComponent;
  let fixture: ComponentFixture<HommeAutoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HommeAutoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HommeAutoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
