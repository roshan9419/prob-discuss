import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaUserInfoComponent } from './qna-user-info.component';

describe('QnaUserInfoComponent', () => {
  let component: QnaUserInfoComponent;
  let fixture: ComponentFixture<QnaUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QnaUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
