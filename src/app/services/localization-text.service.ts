import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IVitaDataService, VitaDataServiceConfig } from './vita-data.service';

export interface IActionItem
{
  Title: string;
  Description: string;
  ExpectedDuration: string;
  Duration: string;
}

const englishDurationActions : IActionItem[] =
[
  { Title: "Overview", Description: "Show only selected projects for a quick overview.", ExpectedDuration: "~5min", Duration: "S" },
  { Title: "Show all Projects", Description: "Show bullet points of all topics.", ExpectedDuration: "~10min", Duration: "M" },
  { Title: "Expand Everything", Description: "Show the expanded content of all topics in all sections.", ExpectedDuration: "~20min", Duration: "L" },
];

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

  public get DurationActions(): IActionItem[]
  {
    return englishDurationActions;
  }

  public get ContentMainHeader() : String {
    return this.contentMainHeader;
  }

  public get DeveloperNameText() : String {
    return "Matthias Ruttmann";
  }

  public get IsIos() : boolean {
    let is_iPad = navigator.userAgent.includes("iPad");
    let is_iPhone = navigator.userAgent.includes("iPhone");
    return is_iPhone || is_iPad;
  }

  public get DeveloperProfileText() : String {
    return "Developer Profile";
  }

  public get FilterTitle() : String {
    return "Content Filter";
  }

  public get MoreText() : String[] {
    if (this.dataService.duration == "S")
    {
      return [ "There is more about me.", "Expand this topic to find out." ];
    }
    else
    {
      return [ "Collapse this topic to return to the remove additional details." ];
    }
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
      return "One more thing";
    }
    else
    {
      return "Interessen";
    }
  }
  
  public get FullDetailsText() : String {
    if (this.dataService.language == "English")
    {
      return "Extended\u00A0Vita";
    }
    else
    {
      return "Mehr Details";
    }
  }

  public DetailStateText(detailLevel: string)
  {
    if (detailLevel == "S")
    {
      return "Overview";
    }

    if (detailLevel == "M")
    {
      return "All Projects";
    }

    if (detailLevel == "L")
    {
      return "Full Details";
    }

    return "";
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
