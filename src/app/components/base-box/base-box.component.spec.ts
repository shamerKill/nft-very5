import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBoxComponent } from './base-box.component';

describe('BaseBoxComponent', () => {
  let component: BaseBoxComponent;
  let fixture: ComponentFixture<BaseBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
