import { TestBed } from '@angular/core/testing';

import { BaseMessageService } from './base-message.service';

describe('BaseMessageService', () => {
  let service: BaseMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
