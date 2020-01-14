import { TestBed } from '@angular/core/testing';

import { VitaEntryService } from './vita-entry.service';

describe('CareerEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VitaEntryService = TestBed.get(VitaEntryService);
    expect(service).toBeTruthy();
  });
});
