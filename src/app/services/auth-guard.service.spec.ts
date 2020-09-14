import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LocalStorageModule } from 'angular-2-local-storage';

import { AuthGuardService } from './auth-guard.service';
import { AuthenticateService } from './authenticate.service';

describe('AuthGuardService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        LocalStorageModule.forRoot({
          storageType: 'localStorage',
        }),
        ],
      providers:[
        AuthenticateService,
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: AuthGuardService = TestBed.get(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
