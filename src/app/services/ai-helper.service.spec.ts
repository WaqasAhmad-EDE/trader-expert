import { TestBed } from '@angular/core/testing';

import { AiHelperService } from './ai-helper.service';

describe('AiHelperService', () => {
  let service: AiHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
