import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrchQuesItemComponent } from './srch-ques-item.component';

describe('SrchQuesItemComponent', () => {
  let component: SrchQuesItemComponent;
  let fixture: ComponentFixture<SrchQuesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrchQuesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrchQuesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
