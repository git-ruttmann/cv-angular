import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { Observable } from 'rxjs';

import { VitaEntryService } from '../services/vita-entry.service';
import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { BaseStateService } from '../services/base-state.service';

const urlToVitaEntryEnum = {
  "person" : VitaEntryEnum.Person,
  "projects" : VitaEntryEnum.Project,
  "technologies" : VitaEntryEnum.Technology,
  "strength" : VitaEntryEnum.Strength,
  "interests" : VitaEntryEnum.Interest,
};

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css', '../app.component.css']
})
export class ContentComponent implements OnInit {

  public content = "Hello";
  entries: Observable<VitaEntry[]>;

  @ViewChild('textcontent', { static : true })
  contentElt: ElementRef;

  constructor(
      private router : Router, 
      private location : Location, 
      private dataService : VitaEntryService,
      private baseStateService : BaseStateService) {
    this.content = router.url.substr(1).toLowerCase();
    this.entries = dataService.entries;

    var vitaEntryType = urlToVitaEntryEnum[this.content];

    this.dataService.load(vitaEntryType);
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
    this.baseStateService.returnToBase();
  }

  catchClickOnContent(event : Event)
  {
    event.stopPropagation();
  }

  scrollTo(elt : number) {
    var item = this.contentElt.nativeElement.querySelector("#id_" + elt);
    item.scrollIntoView();
  }
}
