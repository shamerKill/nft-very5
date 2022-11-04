import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreItemComponent } from './item.component';

describe('ExploreItemComponent', () => {
  let component: ExploreItemComponent;
  let fixture: ComponentFixture<ExploreItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
