import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZanqaEditComponent } from './zanqa-edit.component';

describe('ZanqaEditComponent', () => {
  let component: ZanqaEditComponent;
  let fixture: ComponentFixture<ZanqaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZanqaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZanqaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
