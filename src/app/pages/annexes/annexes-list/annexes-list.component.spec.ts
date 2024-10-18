import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesListComponent } from './annexes-list.component';

describe('AnnexesListComponent', () => {
  let component: AnnexesListComponent;
  let fixture: ComponentFixture<AnnexesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnexesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnexesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
