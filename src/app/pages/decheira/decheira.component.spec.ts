import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecheiraComponent } from './decheira.component';

describe('DecheiraComponent', () => {
  let component: DecheiraComponent;
  let fixture: ComponentFixture<DecheiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecheiraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DecheiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
