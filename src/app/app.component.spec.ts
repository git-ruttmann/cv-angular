import { TestBed, async, tick, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AppComponent } from './app.component';
import { routes } from './app-routing.module';
import { LoginComponent } from './base/login.component';
import { ReadonlyDirective } from './base/readonly.directive';

describe('AppComponent', () => {
  let router: Router;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        NoopAnimationsModule,
        FormsModule,
        LocalStorageModule.forRoot({
          storageType: 'localStorage',
        }),
      ],
      declarations: [
        ReadonlyDirective,
        AppComponent,
        LoginComponent,
      ],
    });
    
    await TestBed.compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'karriere'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('karriere');
  });

  it('login should display consent text', fakeAsync(() => {
    fixture.ngZone.run(() => router.initialNavigation());
    tick();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.consenttext')?.textContent)
      .toContain('By entering the code, you accept the use of cookies and tracking.');
  }));
});
