import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { VitaEntryService } from '../services/vita-entry.service';
import { VitaEntry, VitaEntryEnum } from '../vita-entry';
import { Router } from '@angular/router';
import { LocalizationTextService } from '../services/localization-text.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./content.component.css']
})
export class WelcomeComponent implements OnInit {
  entries: Observable<VitaEntry[]>;
  target: string;

  constructor(
    private router : Router, 
    public localizationService: LocalizationTextService,
    private dataService : VitaEntryService)
  {
    this.entries = dataService.entries;
    this.dataService.load(VitaEntryEnum.Introduction);
    this.target = this.router.routerState.snapshot.root.queryParams["target"];
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(["/"]);
  }

  catchClickOnContent(event : Event)
  {
    event.stopPropagation();
  }

  selectDuration(duration: string)
  {
    this.dataService.setDuration(duration);
    this.router.navigate([this.target || ""]);
  }
}
