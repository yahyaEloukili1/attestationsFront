import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionLaayouneComponent } from './region-laayoune.component';

describe('RegionLaayouneComponent', () => {
  let component: RegionLaayouneComponent;
  let fixture: ComponentFixture<RegionLaayouneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionLaayouneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionLaayouneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
