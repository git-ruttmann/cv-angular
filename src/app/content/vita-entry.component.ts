import { Component, Input } from '@angular/core';
import { TrackingService } from '../services/tracking.service';
import { VitaEntryViewModel, VitaSentenceEnum } from '../vita-entry';

@Component({
  selector: 'app-vita-entry',
  templateUrl: './vita-entry.component.html',
  styleUrls: ['./content.component.css', './vita-entry.component.css']
})
export class VitaEntryComponent {
  vitaSentenceEnum = VitaSentenceEnum;

  @Input()
  entry: VitaEntryViewModel;

  constructor(private trackingService : TrackingService) {
  }

  public urlClicked(url: string)
  {
    this.trackingService.TrackLink(url);
  }
}
