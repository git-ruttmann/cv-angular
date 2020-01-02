import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css', './app.component.css']
})
export class ContentComponent implements OnInit {

  private content = "Hello";

  constructor(private router : Router, private location : Location) { 
    this.content = router.url.substr(1);
    console.log("start " +  router.url);
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}
