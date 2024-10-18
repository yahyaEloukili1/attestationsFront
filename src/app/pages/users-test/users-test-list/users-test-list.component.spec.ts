import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTestListComponent } from './users-test-list.component';

describe('UsersTestListComponent', () => {
  let component: UsersTestListComponent;
  let fixture: ComponentFixture<UsersTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTestListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
