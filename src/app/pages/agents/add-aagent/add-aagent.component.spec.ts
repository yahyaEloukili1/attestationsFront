import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAagentComponent } from './add-aagent.component';

describe('AddAagentComponent', () => {
  let component: AddAagentComponent;
  let fixture: ComponentFixture<AddAagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAagentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
