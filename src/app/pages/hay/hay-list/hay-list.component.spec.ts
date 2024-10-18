import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HayListComponent } from './hay-list.component';

describe('HayListComponent', () => {
  let component: HayListComponent;
  let fixture: ComponentFixture<HayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HayListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
