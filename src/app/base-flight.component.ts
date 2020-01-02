import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const duration = 3400;
const strokeLength = 1600;

@Component({
  selector: 'app-base-flight',
  templateUrl: './base-flight.component.html',
  styleUrls: [ './app.component.css' ],
})
export class BaseFlightComponent implements OnInit {

  isFlyPathVisible = false;
  isOpen = false;

  constructor(private router : Router) { }

  ngOnInit() {
  }

  onClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue as String;

    if (value.startsWith("aoi")) {
      this.router.navigate(["/" + value.substr(3).toLowerCase()]);
    }
  }
}
