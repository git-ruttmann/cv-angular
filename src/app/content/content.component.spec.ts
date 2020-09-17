import { Injectable, Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { LocalStorageModule } from 'angular-2-local-storage';
import { BehaviorSubject } from 'rxjs';

import { ContentComponent } from './content.component';
import { ContentHeaderComponent } from './content-header.component';
import { IVitaDataService, VitaDataServiceConfig } from '../services/vita-data.service';
import { VitaEntryComponent } from './vita-entry.component';
import { routes } from '../app-routing.module';
import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { AuthGuardService } from '../services/auth-guard.service';
import { TrackingService, ITrackedItem } from '../services/tracking.service';
import { APP_BASE_HREF } from '@angular/common';

@Injectable()
class AuthGuardMock implements Partial<AuthGuardService>
{
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean 
  {
    return true;
  }
}

/**
 * empty tracking
 */
@Injectable()
class NoTrackingMock implements Partial<TrackingService>
{
  public TrackTopics(url: string, items: ITrackedItem[])
  {
  }

  public Track(url: string, topic: string, scroll: number)
  {    
  }
}

/**
 * provide mocked data
 */
@Injectable()
class VitaDataMock implements IVitaDataService
{
  entries: BehaviorSubject<VitaEntry[]>;
  duration: string = "S";
  language: string = "German";

  mockedPersonData: VitaEntry[] = [
    VitaEntry.FromJson({"vitaEntryType":"Person","title":"Passion","lines":["Text about Passion",""],"attributes":["German","Short","Medium","Long"]}),
    VitaEntry.FromJson({"vitaEntryType":"Person","title":"Bullets only","lines":["- The first bullet","- The second bullet",""],"attributes":["German","Short"]}),
    VitaEntry.FromJson({"vitaEntryType":"Person","title":"Bullets and text","lines":["Initial text for the expert","- The first bullet","- The second bullet","Trailing text",""],"attributes":["German","Short"]}),
    VitaEntry.FromJson({"vitaEntryType":"Person","title":"Text and links","lines":[
      "Some initial text",
      "- Bullet one",
      "- [\"bullet link\", \"https://my.mycv.com/bullettarget\"]",
      "- More bullets",
      "[\"Normal link\", \"https://my.mycv.com/normaltarget\"]",
    ],"attributes":["German","Short"]}),
    VitaEntry.FromJson({"vitaEntryType":"Person","title":"For all explicitly","lines":[],"attributes":["German","Short"]}),
  ];

  public constructor()
  {
    this.entries = new BehaviorSubject<VitaEntry[]>([]);
  }

  load(vitaEntryType: VitaEntryEnum)
  {
    if (vitaEntryType == VitaEntryEnum.Person) 
    {
      this.entries.next(this.mockedPersonData);
    }
    else
    {
      this.entries.next([]);
    }
  }

  setDuration(duration: string)
  {
    this.duration = duration;
  }  
}

@Component({
  template: '<router-outlet></router-outlet>',
})
class TestRootComponent {
  @ViewChild(RouterOutlet)
  routerOutlet: RouterOutlet;
}

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<TestRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestRootComponent,
        ContentHeaderComponent, 
        ContentComponent,
        VitaEntryComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthGuardService, useValue : new AuthGuardMock() },
        { provide: TrackingService, useValue : new NoTrackingMock() },
        { provide: VitaDataServiceConfig, useValue : new VitaDataMock() }
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        LocalStorageModule.forRoot({
          storageType: 'localStorage',
        }),
      ],
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    
    const router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TestRootComponent);
    fixture.ngZone.run(() => {
      router.navigateByUrl("/person");
    });
    tick();
    
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(ContentComponent)).componentInstance;    
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain all topics', () => {
    const entryelements = fixture.debugElement.queryAll(By.css("app-vita-entry"));
    expect(entryelements).toBeTruthy();
    expect(entryelements.length).toBe(5);

    const entryIndices = fixture.debugElement.queryAll(By.css(".entryindex"));
    expect(entryIndices).toBeTruthy();
    expect(entryIndices.length).toBe(5);
  });

  it('should format link correctly', () => {
    const contentDebugElement = fixture.debugElement.query(By.css("#right .textcontent"));
    expect(contentDebugElement).toBeTruthy();

    const htmlContent = contentDebugElement.nativeElement;
    expect(htmlContent.innerHTML).toContain("href=\"https://my.mycv.com/normaltarget\"> Normal link </a>");
  });

  it('should format bullets and they should have a class', () => {
    const entryelements = fixture.debugElement.queryAll(By.css("app-vita-entry"));
    expect(entryelements).toBeTruthy();

    const bulletsOnly = entryelements[2];
    const ul = bulletsOnly.query(By.css("ul.vitalist"));
    expect(ul).toBeTruthy();

    const allLi = ul.queryAll(By.css("li.vitalistitem"));
    expect(allLi.length).toBe(2);

    expect(allLi[0].nativeElement.innerText).toBe("The first bullet");
    expect(allLi[1].nativeElement.innerText).toBe("The second bullet");
  });
});
