import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IVitaDataService, VitaDataServiceConfig } from './vita-data.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizationTextService {
  contentMainHeader: String;
  contentSubHeader: String;

  constructor(
    @Inject(VitaDataServiceConfig) private dataService : IVitaDataService,
    private router : Router)
  {
    this.contentMainHeader = "";
    this.contentSubHeader = "";
    this.RouteChanged();
    router.events.subscribe(() => this.RouteChanged());
  }

  public get ContentMainHeader() : String {
    return this.contentMainHeader;
  }

  public get ContentSubHeader() : String {
    return this.contentSubHeader;
  }
  
  public get MoreTopicsText() : string {
    if (this.dataService.language == "English")
    {
      return "More Details";
    }
    else
    {
      return "Mehr Details";
    }
  }
  
  public get LessTopicsText() : string {
    if (this.dataService.language == "English")
    {
      return "Reduce Details";
    }
    else
    {
      return "Weniger Details";
    }
  }

  private RouteChanged(): void
  {
    let state = this.router.routerState.snapshot;
    let url = state.url;

    if (url == "/person")
    {
      if (this.dataService.language == "English")
      {
        this.contentMainHeader = "Me as Person";
        this.contentSubHeader = "subtext";
      }
      else
      {
        this.contentMainHeader = "Person";
      }
    }
    else if (url == "/projects")
    {
      if (this.dataService.language == "English")
      {
        this.contentMainHeader = "Projects"
      }
      else
      {
        this.contentMainHeader = "Projekte"
      }
    }
    else if (url == "/technologies")
    {
      if (this.dataService.language == "English")
      {
        this.contentMainHeader = "Technologies"
      }
      else
      {
        this.contentMainHeader = "Technologien"
      }
    }
    else if (url == "/strength")
    {
      if (this.dataService.language == "English")
      {
        this.contentMainHeader = "Strength"
      }
      else
      {
        this.contentMainHeader = "Stärken"
      }
    }
    else if (url == "/interests")
    {
      if (this.dataService.language == "English")
      {
        this.contentMainHeader = "Uncharted"
      }
      else
      {
        this.contentMainHeader = "Interessen"
      }
    }
    else
    {
      this.contentMainHeader = url;
      this.contentSubHeader = "";
    }
  }
}
