import { Component, Input, Inject } from '@angular/core';
import { IVitaDataService, VitaDataServiceConfig } from '../services/vita-data.service';
import { TrackingEventService } from '../services/tracking.service';
import { LocalizationTextService } from '../services/localization-text.service';

const nextDuration = "SMLS";

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content.component.css', './content-header.component.css']
})
export class ContentHeaderComponent {
  @Input('header-content')
  content: string;

  constructor(
    @Inject(VitaDataServiceConfig) private dataService : IVitaDataService,
    public localizationService: LocalizationTextService,
    private trackingEventService: TrackingEventService)
  {
  }

  isDuration(duration: string): boolean 
  {
    this.dataService.setDuration
    return duration != this.dataService.duration;
  }

  selectNextDuration(event: Event)
  {
    let duration = nextDuration[nextDuration.indexOf(this.dataService.duration) + 1];
    this.dataService.setDuration(duration);
    event.stopPropagation();
    
    this.trackingEventService.Track("duration");
  }
}
