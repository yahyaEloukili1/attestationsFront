import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsEditComponent } from './agents-edit.component';

describe('AgentsEditComponent', () => {
  let component: AgentsEditComponent;
  let fixture: ComponentFixture<AgentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
