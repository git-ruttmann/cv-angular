import { TestBed, tick, async, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageModule } from 'angular-2-local-storage';

import { VitaEntryService } from './vita-entry.service';
import { VitaEntry, VitaEntryEnum, VitaSentenceEnum, VitaEntryParagraph, VitaEntryList, VitaEntryLink, VitaEntryListLink } from '../vita-entry';

describe('VitaEntryService', () => {
  let httpMock : HttpTestingController;
  let vitaResult: VitaEntry[];

  function loadsamplevita() {
    const service: VitaEntryService = TestBed.get(VitaEntryService);
    service.entries.subscribe(x => vitaResult = x);

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
        "[\"normal link\", \"https://my.mycv.com/normaltarget\"]",
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

    return service;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:
      [
        HttpClientTestingModule,
        LocalStorageModule.forRoot({
          storageType: 'localStorage',
        }),
      ]});

      httpMock = TestBed.inject(HttpTestingController);
    }
  );

  it('should be created', () => {
    const service: VitaEntryService = TestBed.get(VitaEntryService);
    expect(service).toBeTruthy();
  });

  it('should query sample data', fakeAsync(() => {
    const service: VitaEntryService = loadsamplevita();

    expect(vitaResult).toBeTruthy();
  }));

  it('Introduction should have the correct language', fakeAsync(() => {
    const service: VitaEntryService = loadsamplevita();

    expect(vitaResult).toBeTruthy();

    service.load(VitaEntryEnum.Introduction);
    expect(vitaResult.length).toBe(1);
    expect(vitaResult[0].language).toBe("German");
    
    service.load(VitaEntryEnum.Person);
    expect(vitaResult.length).toBeGreaterThanOrEqual(5);
    
    let wrongLanguageEntry = vitaResult.filter(x => x.title === "Not for yy");
    expect(wrongLanguageEntry.length).toBe(0);
  }));

  it('Format bullets', fakeAsync(() => {
    const service: VitaEntryService = loadsamplevita();

    service.load(VitaEntryEnum.Person);
    let bulletsEntry = vitaResult.filter(x => x.title === "Bullets and text")[0];

    expect(bulletsEntry.lines[0].sentenceType).toBe(VitaSentenceEnum.Paragraph);
    expect((bulletsEntry.lines[0] as VitaEntryParagraph).line).toBe("Initial text for the expert");
    expect(bulletsEntry.lines[1].sentenceType).toBe(VitaSentenceEnum.List);
    let bulletList = bulletsEntry.lines[1] as VitaEntryList;
    expect(bulletList.items.length).toBe(2);
    expect(bulletList.items[0].line).toBe("The first bullet");
    expect(bulletList.items[1].line).toBe("The second bullet");
    expect((bulletsEntry.lines[2] as VitaEntryParagraph).line).toBe("Trailing text");
  }));

  it('Format links', fakeAsync(() => {
    const service: VitaEntryService = loadsamplevita();

    service.load(VitaEntryEnum.Person);
    let bulletsEntry = vitaResult.filter(x => x.title === "Text and links")[0];
    
    expect(bulletsEntry.lines[2].sentenceType).toBe(VitaSentenceEnum.Link);
    const link = bulletsEntry.lines[2] as VitaEntryLink;
    expect(link.line).toBe("normal link");
    expect(link.url).toBe("https://my.mycv.com/normaltarget");
    
    expect(bulletsEntry.lines[1].sentenceType).toBe(VitaSentenceEnum.List);
    const list = bulletsEntry.lines[1] as VitaEntryList;
    expect(list.items[1].sentenceType).toBe(VitaSentenceEnum.ListLink);
    const listLink = list.items[1] as VitaEntryListLink;
    expect(listLink.line).toBe("bullet link");
    expect(listLink.url).toBe("https://my.mycv.com/bullettarget");
  }));
});
