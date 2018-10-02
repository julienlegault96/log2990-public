import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDiffCounterComponent } from './image-diff-counter.component';

describe('ImageDiffCounterComponent', () => {
  let component: ImageDiffCounterComponent;
  let fixture: ComponentFixture<ImageDiffCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDiffCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDiffCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
