import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDpComponent } from './user-dp.component';

describe('UserDpComponent', () => {
  let component: UserDpComponent;
  let fixture: ComponentFixture<UserDpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
