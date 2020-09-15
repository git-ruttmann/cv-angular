import { AotCompiler } from '@angular/compiler';

export enum VitaEntryEnum {
  Interest,
  Person,
  Technology,
  Strength,
  Project,
  Introduction
}

export enum VitaSentenceEnum
{
  Paragraph,
  List,
  ListItem,
  NoBulletListItem,
  Link,
  ListLink,
}

export interface IVitaEntryLink
{
  line: string;
  url: string;
}

export class VitaEntrySentence
{
  constructor(public sentenceType: VitaSentenceEnum)
  {
  }
}

export class VitaEntryParagraph extends VitaEntrySentence
{
  constructor(public line: string)
  {
    super(VitaSentenceEnum.Paragraph);
    this.line = line;
  }
}

export class VitaEntryList extends VitaEntrySentence
{
  constructor()
  {
    super(VitaSentenceEnum.List);
    this.items = [];
  }

  public items: VitaEntryListSentence[];
}

export class VitaEntryListSentence extends VitaEntrySentence
{
  constructor(type: VitaSentenceEnum, public line: string)
  {
    super(type);
  }
}

export class VitaEntryLink extends VitaEntrySentence implements IVitaEntryLink
{
  constructor(public line: string, public url: string)
  {
    super(VitaSentenceEnum.Link);
  }
}

export class VitaEntryListLink extends VitaEntrySentence implements IVitaEntryLink
{
  constructor(public line: string, public url: string)
  {
    super(VitaSentenceEnum.ListLink);
  }
}

export class VitaEntry {
  title: string;
  language: string;
  duration: string;
  lines: VitaEntrySentence[];
  vitaEntryType: VitaEntryEnum;

  static FromJson(json: any) : VitaEntry
  {
    var entry = new VitaEntry();
    let attributes : string[] = json.attributes;
    entry.title = json.title;
    entry.lines = this.buildSentencesAndLists(json.lines);
    entry.language = attributes.filter(x => x == "English" || x == "German").join();
    let aoiString: string = json.vitaEntryType;
    entry.vitaEntryType = VitaEntryEnum[aoiString as keyof typeof VitaEntryEnum];
    entry.duration = attributes.filter(x => x == "Short" || x == "Medium" || x == "Long").map(x => x.substr(0, 1)).join("");

    return entry;
  }

  private static buildSentencesAndLists(lines: string[]) : VitaEntrySentence[]
  {
    var sentences: VitaEntrySentence[] = [];
    var currentList: VitaEntryList = null;
    for (const line of lines) 
    {
      if (line.startsWith('-') || line.startsWith('*'))
      {
        if (currentList == null)
        {
          currentList = new VitaEntryList()
          sentences.push(currentList);
        }

        const typeOfSentence = line.startsWith('-') ? VitaSentenceEnum.ListItem : VitaSentenceEnum.NoBulletListItem;
        const sentenceText = line.substr(1).trim();
        if (sentenceText.startsWith('[')) {
          const sentence = this.createLinkEntry(sentenceText, true);
          currentList.items.push(sentence);
        }
        else
        {
          const sentence = new VitaEntryListSentence(typeOfSentence, sentenceText);
          currentList.items.push(sentence);
        }
      }
      else if (line.startsWith('['))
      {
        currentList = null;
        sentences.push(this.createLinkEntry(line, false));
      }
      else
      {
        currentList = null;
        sentences.push(new VitaEntryParagraph(line));
      } 
    }

    return sentences;
  }

  private static createLinkEntry(line: string, inList: boolean) : VitaEntryLink {
    line = line.trim();
    if (!line.endsWith(']'))
    {
      throw "Link must start with '[' and end with ']'";
    }

    let url, text: string;
    url = line.substr(1, line.length - 2);
    const pos = url.indexOf("\", \"");

    if (pos > 0) {
      text = url.substr(1, pos - 1).trim();
      url = url.substr(pos + 4, url.length - pos - 5);
    }

    if (inList)
    {
      return new VitaEntryListLink(text, url);
    }

    return new VitaEntryLink(text, url);
  }
}
