import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { VitaeEntryService } from './vitae-entry.service';
import { Observable } from 'rxjs';
import { VitaeEntry } from './vitae-entry';
import { BaseStateService } from './base-state.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css', './app.component.css']
})
export class ContentComponent implements OnInit {

  private content = "Hello";

  @ViewChild('textcontent', { static : true })
  contentElt: ElementRef;

  constructor(
      private router : Router, 
      private location : Location, 
      private dataService : VitaeEntryService,
      private baseStateService : BaseStateService) {
    this.content = router.url.substr(1);
    console.log("start " +  router.url);
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
    this.baseStateService.returnToBase();
  }
}
