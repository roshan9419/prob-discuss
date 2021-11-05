import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectPhotoNameComponent } from './rect-photo-name.component';

describe('RectPhotoNameComponent', () => {
  let component: RectPhotoNameComponent;
  let fixture: ComponentFixture<RectPhotoNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectPhotoNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RectPhotoNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
