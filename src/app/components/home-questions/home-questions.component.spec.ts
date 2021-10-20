import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeQuestionsComponent } from './home-questions.component';

describe('HomeQuestionsComponent', () => {
  let component: HomeQuestionsComponent;
  let fixture: ComponentFixture<HomeQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
