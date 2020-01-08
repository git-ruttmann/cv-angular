import { AotCompiler } from '@angular/compiler';

export enum VitaEntryEnum {
  Interest,
  Person,
  Technology,
  Strength,
  Project,
}

export class VitaEntry {
  title: string;
  lines: string[];
  vitaEntryType: VitaEntryEnum;

  static FromJson(json: any)
  {
    var entry = new VitaEntry();
    entry.title = json.title;
    entry.lines = json.lines;
    let aoiString: string = json.vitaEntryType;
    entry.vitaEntryType = VitaEntryEnum[aoiString as keyof typeof VitaEntryEnum];
    return entry;
  }
}
