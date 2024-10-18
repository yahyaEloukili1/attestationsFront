import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictsListComponent } from './districts-list.component';

describe('DistrictsListComponent', () => {
  let component: DistrictsListComponent;
  let fixture: ComponentFixture<DistrictsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistrictsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
