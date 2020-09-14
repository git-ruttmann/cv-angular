import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageModule } from 'angular-2-local-storage';

import { VitaEntryService } from './vita-entry.service';

describe('VitaEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:
    [
      HttpClientTestingModule,
      LocalStorageModule.forRoot({
        storageType: 'localStorage',
      }),
      ]
  }));

  it('should be created', () => {
    const service: VitaEntryService = TestBed.get(VitaEntryService);
    expect(service).toBeTruthy();
  });
});
