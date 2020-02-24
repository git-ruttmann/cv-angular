import { AotCompiler } from '@angular/compiler';

export enum VitaEntryEnum {
  Interest,
  Person,
  Technology,
  Strength,
  Project,
}

export enum VitaSentenceEnum
{
  Paragraph,
  List,
  ListItem,
  NoBulletListItem,
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

export class VitaEntry {
  title: string;
  language: string;
  duration: string;
  lines: VitaEntrySentence[];
  vitaEntryType: VitaEntryEnum;

  static FromJson(json: any)
  {
    var entry = new VitaEntry();
    let attributes : string[] = json.attributes;
    entry.title = json.title;
    entry.lines = this.buildSentencesAndLists(json.lines);
    entry.language = attributes.filter(x => x == "English" || x == "German")[0] || "English";
    let aoiString: string = json.vitaEntryType;
    entry.vitaEntryType = VitaEntryEnum[aoiString as keyof typeof VitaEntryEnum];
    return entry;
  }

  private static buildSentencesAndLists(lines: string[]) : VitaEntrySentence[]
  {
    var sentences: VitaEntrySentence[] = [];
    var currentList: VitaEntryList = null;
    for (const line of lines) 
    {
      if (line.startsWith('-'))
      {
        if (currentList == null)
        {
          currentList = new VitaEntryList()
          sentences.push(currentList);
        }

        currentList.items.push(new VitaEntryListSentence(VitaSentenceEnum.ListItem, line.substr(1).trim()))
      }
      else if (line.startsWith('*'))
      {
        if (currentList == null)
        {
          currentList = new VitaEntryList()
          sentences.push(currentList);
        }
        
        currentList.items.push(new VitaEntryListSentence(VitaSentenceEnum.NoBulletListItem, line.substr(1).trim()))
      }
      else
      {
        currentList = null;
        sentences.push(new VitaEntryParagraph(line));
      } 
    }

    return sentences;
  }
}
