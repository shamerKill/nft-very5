import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatherItemComponent } from './item.component';

describe('GatherItemComponent', () => {
  let component: GatherItemComponent;
  let fixture: ComponentFixture<GatherItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatherItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatherItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
