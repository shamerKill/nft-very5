import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNftComponent } from './allNft.component';

describe('AllNftComponent', () => {
  let component: AllNftComponent;
  let fixture: ComponentFixture<AllNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllNftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
