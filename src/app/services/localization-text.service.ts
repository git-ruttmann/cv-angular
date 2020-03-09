import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VitaEntryService } from './vita-entry.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LocalizationTextService {
  contentMainHeader: String;
  contentSubHeader: String;

  constructor(
    private dataService : VitaEntryService,
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
  
  public get WelcomeShort() : String {
    if (this.dataService.language == "English")
    {
      return "Let's get to the point. Details are negligible.";
    }
    else
    {
      return "Bring es auf den Punkt, Details sehen wir später.";
    }
  }
  
  public get WelcomeMedium() : String {
    if (this.dataService.language == "English")
    {
      return "Show me the bullet points, I'll connect them myself.";
    }
    else
    {
      return "Zeige alle Stickpunkte, ich sortiere sie selbst.";
    }
  }
  
  public get WelcomeLong() : String {
    if (this.dataService.language == "English")
    {
      return "Give me a glance how you think. Incomplete.";
    }
    else
    {
      return "Erzähl mir, wie du denkst. Unvollständig.";
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
        this.contentMainHeader = "Person";
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
        this.contentMainHeader = "Interests"
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
