import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStarComponent } from './my-star.component';

describe('MyNftComponent', () => {
  let component: MyStarComponent;
  let fixture: ComponentFixture<MyStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyStarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
