import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElmarsaComponent } from './elmarsa.component';

describe('ElmarsaComponent', () => {
  let component: ElmarsaComponent;
  let fixture: ComponentFixture<ElmarsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElmarsaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElmarsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
