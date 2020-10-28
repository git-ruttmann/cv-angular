import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IVitaDataService, VitaDataServiceConfig } from './vita-data.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizationTextService {
  contentMainHeader: String;

  constructor(
    @Inject(VitaDataServiceConfig) private dataService : IVitaDataService,
    private router : Router)
  {
    this.contentMainHeader = "";
    this.RouteChanged();
    router.events.subscribe(() => this.RouteChanged());
  }

  public get ContentMainHeader() : String {
    return this.contentMainHeader;
  }

  public get DeveloperNameText() : String {
    return "Matthias Ruttmann";
  }

  public get DeveloperProfileText() : String {
    return "Developer Profile";
  }

  public get PersonText() : String
  {
    if (this.dataService.language == "English")
    {
      return "Me as Person";
    }
    else
    {
      return "Persönlichkeit";
    }
  }

  public get ProjectsText() : String
  {
    if (this.dataService.language == "English")
    {
      return "Projects";
    }
    else
    {
      return "Projekte";
    }
  }

  public get TechnologiesText() : String
  {
    if (this.dataService.language == "English")
    {
      return "Technologies";
    }
    else
    {
      return "Technologien";
    }
  }

  public get StrengthText() : String
  {
    if (this.dataService.language == "English")
    {
      return "Strength";
    }
    else
    {
      return "Stärken";
    }
  }

  public get InterestsText() : String
  {
    if (this.dataService.language == "English")
    {
      return "Uncharted";
    }
    else
    {
      return "Interessen";
    }
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
      this.contentMainHeader = this.PersonText;
    }
    else if (url == "/projects")
    {
      this.contentMainHeader = this.ProjectsText;
    }
    else if (url == "/technologies")
    {
      this.contentMainHeader = this.TechnologiesText;
    }
    else if (url == "/strength")
    {
      this.contentMainHeader = this.StrengthText;
    }
    else if (url == "/interests")
    {
      this.contentMainHeader = this.InterestsText;
    }
    else
    {
      this.contentMainHeader = url;
    }
  }
}
