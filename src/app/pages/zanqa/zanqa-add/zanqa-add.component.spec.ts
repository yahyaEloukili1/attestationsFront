import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZanqaAddComponent } from './zanqa-add.component';

describe('ZanqaAddComponent', () => {
  let component: ZanqaAddComponent;
  let fixture: ComponentFixture<ZanqaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZanqaAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZanqaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
