import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageModule } from 'angular-2-local-storage';

import { VitaDataService, IVitaDataService } from './vita-data.service';
import { VitaEntryEnum, VitaSentenceEnum, VitaEntryParagraph, VitaEntryList, VitaEntryLink, VitaEntryListLink, VitaEntryViewModel } from '../vita-entry';

describe('VitaEntryService', () => {
  let httpMock : HttpTestingController;
  let vitaResult: VitaEntryViewModel[];

  function loadsamplevita() {
    const service: VitaDataService = TestBed.inject(VitaDataService);
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
    const service: IVitaDataService = TestBed.inject(VitaDataService);
    expect(service).toBeTruthy();
  });

  it('should query sample data', fakeAsync(() => {
    const service: IVitaDataService = loadsamplevita();

    expect(vitaResult).toBeTruthy();
  }));

  it('Introduction should have the correct language', fakeAsync(() => {
    const service: IVitaDataService = loadsamplevita();

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
    const service: IVitaDataService = loadsamplevita();

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
    const service: IVitaDataService = loadsamplevita();

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

describe('VitaEntryService duration filter', () => {
  let httpMock : HttpTestingController;
  let vitaResult: VitaEntryViewModel[];

  function loaddetaillevelvita(duration: string) {
    const service: VitaDataService = TestBed.inject(VitaDataService);
    service.entries.subscribe(x => vitaResult = x);

    let fakeVita = [
      {"vitaEntryType":"Person","title":"short only","lines":["short content"],"attributes":["English","Short"]},
      {"vitaEntryType":"Person","title":"short only","lines":["german content must be excluded"],"attributes":["German","Short"]},
      {"vitaEntryType":"Person","title":"short and medium","lines":["short content",""],"attributes":["English","Short"]},
      {"vitaEntryType":"Person","title":"short and medium","lines":["medium content",""],"attributes":["English","Medium"]},
      {"vitaEntryType":"Person","title":"short and long","lines":["short content"],"attributes":["English","Short"]},
      {"vitaEntryType":"Person","title":"short and long","lines":["long content"],"attributes":["English","Long"]},
      {"vitaEntryType":"Person","title":"medium only","lines":["medium content"],"attributes":["English","Medium"]},
      {"vitaEntryType":"Person","title":"medium and long","lines":["medium content"],"attributes":["English","Medium"]},
      {"vitaEntryType":"Person","title":"medium and long","lines":["long content"],"attributes":["English","Long"]},
      {"vitaEntryType":"Person","title":"short and medium+long","lines":["short content"],"attributes":["English","Short"]},
      {"vitaEntryType":"Person","title":"short and medium+long","lines":["medium+long content"],"attributes":["English","Medium","Long"]},
      {"vitaEntryType":"Person","title":"short and medium and long","lines":["short content"],"attributes":["English","Short"]},
      {"vitaEntryType":"Person","title":"short and medium and long","lines":["medium content"],"attributes":["English","Medium"]},
      {"vitaEntryType":"Person","title":"short and medium and long","lines":["long content"],"attributes":["English","Long"]},
      {"vitaEntryType":"Person","title":"medium and long combined","lines":["medium and long content"],"attributes":["English","Medium","Long"]},
      {"vitaEntryType":"Person","title":"long only","lines":["long content"],"attributes":["English","Long"]},
      ];
  
    service.preload(true);
    const interceptedRequest = httpMock.expectOne("api/v1/vita");
    interceptedRequest.flush( { entries : fakeVita } );

    service.setDuration(duration);
    service.load(VitaEntryEnum.Person);

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

  it('short filter should show short only content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("S");

    let entries = vitaResult.filter(x => x.title === "short only");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
  }));

  it('short filter should show short and medium content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("S");

    let entries = vitaResult.filter(x => x.title === "short and medium");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("short content");
  }));

  it('short filter should show short and long content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("S");

    let entries = vitaResult.filter(x => x.title === "short and long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(false);
  }));

  it('short filter should show all size content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("S");

    let entries = vitaResult.filter(x => x.title === "short and medium and long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("short content");
  }));

  it('short filter should show short version of short,medium+long', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("S");

    let entries = vitaResult.filter(x => x.title === "short and medium+long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("short content");
  }));

  it('short filter should hide non-short content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("S");

    let mediumAndLongEntries = vitaResult.filter(x => x.title === "medium and long");
    expect(mediumAndLongEntries.length).toBe(0);

    let mediumLongCombinedEntries = vitaResult.filter(x => x.title === "medium and long combined");
    expect(mediumLongCombinedEntries.length).toBe(0);
    
    let mediumOnlyEntries = vitaResult.filter(x => x.title === "medium only");
    expect(mediumOnlyEntries.length).toBe(0);
    
    let longOnlyEntries = vitaResult.filter(x => x.title === "long only");
    expect(longOnlyEntries.length).toBe(0);
  }));

  it('medium filter should show short only content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "short only");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
  }));

  it('medium filter should show short and medium content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "short and medium");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("medium content");
  }));

  it('medium filter should show short and long content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "short and long");
    expect(entries.length).toBe(1);
    let shortAndLongEntry = entries[0];
    expect(shortAndLongEntry.canExpand).toBe(true);
    expect(shortAndLongEntry.expanded).toBe(false);
    expect((<VitaEntryParagraph>shortAndLongEntry.lines[0]).line).toBe("short content");
  }));

  it('medium filter should show all size content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entry = vitaResult.filter(x => x.title === "short and medium and long");
    expect(entry.length).toBe(1);
    let allSizeEntry = entry[0];
    expect(allSizeEntry.canExpand).toBe(true);
    expect(allSizeEntry.expanded).toBe(false);
    expect((<VitaEntryParagraph>allSizeEntry.lines[0]).line).toBe("medium content");
  }));

  it('medium filter should show medium content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "medium and long");
    expect(entries.length).toBe(1);
    let mediumAndLongEntry = entries[0];
    expect(mediumAndLongEntry.canExpand).toBe(true);
    expect(mediumAndLongEntry.expanded).toBe(false);
    expect((<VitaEntryParagraph>mediumAndLongEntry.lines[0]).line).toBe("medium content");
  }));

  it('medium filter should show medium and long combined content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entry = vitaResult.filter(x => x.title === "medium and long combined");
    expect(entry.length).toBe(1);
    let mediumLongCombinedEntry = entry[0];
    expect(mediumLongCombinedEntry.canExpand).toBe(false);
    expect(mediumLongCombinedEntry.expanded).toBe(false);
    expect((<VitaEntryParagraph>mediumLongCombinedEntry.lines[0]).line).toBe("medium and long content");
  }));

  it('medium filter should show short version of short,medium+long', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "short and medium+long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("short content");
  }));

  it('medium filter should show medium only content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "medium only");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("medium content");
  }));

  it('medium filter should hide non-short-or-medium content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("M");

    let entries = vitaResult.filter(x => x.title === "long only");
    expect(entries.length).toBe(0);
  }));

  it('long filter should show short only content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "short only");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
  }));

  it('long filter should show short and medium content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "short and medium");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("medium content");
  }));

  it('long filter should show short and long content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "short and long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(true);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("long content");
  }));

  it('long filter should show all size content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "short and medium and long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(true);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("long content");
  }));

  it('long filter should show medium content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "medium and long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(true);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("long content");
  }));

  it('long filter should show medium and long combined content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "medium and long combined");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("medium and long content");
  }));

  it('long filter should show short version of short,medium+long', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "short and medium+long");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(true);
    expect(entry.expanded).toBe(true);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("medium+long content");
  }));

  it('long filter should show medium only content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "medium only");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect(entry.canExpand).toBe(false);
    expect(entry.expanded).toBe(false);
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("medium content");
  }));

  it('long filter should show long only content', fakeAsync(() => {
    const service: IVitaDataService = loaddetaillevelvita("L");

    let entries = vitaResult.filter(x => x.title === "long only");
    expect(entries.length).toBe(1);
    let entry = entries[0];
    expect((<VitaEntryParagraph>entry.lines[0]).line).toBe("long content");
  }));
});
