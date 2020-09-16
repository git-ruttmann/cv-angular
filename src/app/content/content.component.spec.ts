import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LocalStorageModule } from 'angular-2-local-storage';
import { ContentComponent } from './content.component';
import { ContentHeaderComponent } from './content-header.component';
import { VitaEntryService } from '../services/vita-entry.service';
import { VitaEntryComponent } from './vita-entry.component';
import { By } from '@angular/platform-browser';
import { routes } from '../app-routing.module';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { LocalizationTextService } from '../services/localization-text.service';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let httpMock: HttpTestingController;
  let service: VitaEntryService;

  function loadsamplevita() {
    service = TestBed.inject(VitaEntryService);

    let fakeVita = [
      {"vitaEntryType":"Introduction","title":"Herzlich willkommen.","lines":["Hello, you're from the group dotnet.",""],"attributes":["German","Short","Medium","Long"]},
      {"vitaEntryType":"Person","title":"Passion","lines":["Text about Passion",""],"attributes":["German","Short","Medium","Long"]},
      {"vitaEntryType":"Person","title":"Bullets only","lines":["- The first bullet","- The second bullet",""],"attributes":["German","Short"]},
      {"vitaEntryType":"Person","title":"Bullets and text","lines":["Initial text for the expert","- The first bullet","- The second bullet","Trailing text",""],"attributes":["German","Short"]},
      {"vitaEntryType":"Person","title":"Text and links","lines":[
        "Some initial text",
        "- Bullet one",
        "- [\"bullet link\", \"https://my.mycv.com/bullettarget\"]",
        "- More bullets",
        "[\"Normal link\", \"https://my.mycv.com/normaltarget\"]",
      ],"attributes":["German","Short"]},
      {"vitaEntryType":"Person","title":"For all explicitly","lines":[],"attributes":["German","Short"]},
      {"vitaEntryType":"Person","title":"Not for yy","lines":["      "],"attributes":["English","Short"]},
      {"VitaEntryType":"Person","title":"For all explicitly","lines":[],"attributes":["English","Short"]},
      {"vitaEntryType":"Strength","title":"Strength1","lines":["Text for strength one.",""],"attributes":["German","English","Short"]},
      {"vitaEntryType":"Technology","title":"Tech1","lines":["Text for tech1",""],"attributes":["German","English","Short"]},
      {"vitaEntryType":"Interest","title":"Motivation","lines":["I'm motivated. Yeah.","        "],"attributes":["German","English","Short"]}
      ];
  
    service.preload(true);
    const interceptedRequest = httpMock.expectOne("api/v1/vita");
    interceptedRequest.flush( { entries : fakeVita } );
  }

  function fakeAuthenticate() {
    const authService = TestBed.inject(AuthenticateService);
    authService.Authenticate("abc");
    authService.SetFirstLogon();
    const interceptedRequest = httpMock.expectOne("api/v1/authenticate");
    interceptedRequest.flush("Ok");
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ContentHeaderComponent, 
        ContentComponent,
        VitaEntryComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        LocalStorageModule.forRoot({
          storageType: 'localStorage',
        }),
      ],
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(fakeAsync(() => {
    loadsamplevita();
    fakeAuthenticate();

    const router = TestBed.inject(Router);
    router.navigateByUrl("/person");
    tick();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
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

    expect(allLi[0].nativeElement.innerText).toBe("The bad bullet");
    expect(allLi[1].nativeElement.innerText).toBe("The second bullet");
  });
});
