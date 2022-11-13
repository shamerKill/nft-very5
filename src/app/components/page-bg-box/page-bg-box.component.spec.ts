import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBgBoxComponent } from './page-bg-box.component';

describe('PageBgBoxComponent', () => {
  let component: PageBgBoxComponent;
  let fixture: ComponentFixture<PageBgBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageBgBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageBgBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
