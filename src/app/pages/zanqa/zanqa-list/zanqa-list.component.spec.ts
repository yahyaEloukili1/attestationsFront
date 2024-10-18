import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZanqaListComponent } from './zanqa-list.component';

describe('ZanqaListComponent', () => {
  let component: ZanqaListComponent;
  let fixture: ComponentFixture<ZanqaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZanqaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZanqaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
