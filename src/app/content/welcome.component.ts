import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { IVitaDataService, VitaDataServiceConfig } from '../services/vita-data.service';
import { VitaEntry, VitaEntryEnum } from '../vita-entry';
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
    @Inject(VitaDataServiceConfig) private dataService : IVitaDataService)
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
