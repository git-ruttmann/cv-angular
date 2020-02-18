import { Component, OnInit, Input } from '@angular/core';
import { VitaEntryService } from '../services/vita-entry.service';

const nextDuration = "SMLS";

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content.component.css', './content-header.component.css']
})
export class ContentHeaderComponent {
  @Input('header-content')
  content: string;

  constructor(private dataService : VitaEntryService ) {
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
  }
}
