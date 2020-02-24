import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { VitaEntry, VitaSentenceEnum } from '../vita-entry';

@Component({
  selector: 'app-vita-entry',
  templateUrl: './vita-entry.component.html',
  styleUrls: ['./content.component.css']
})
export class VitaEntryComponent {
  vitaSentenceEnum = VitaSentenceEnum;

  @Input()
  entry: VitaEntry;

  constructor() {
  }
}
