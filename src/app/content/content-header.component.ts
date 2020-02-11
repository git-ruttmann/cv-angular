import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content.component.css', './content-header.component.css']
})
export class ContentHeaderComponent implements OnInit {

  constructor() { }

  @Input('header-content')
  content: string;

  ngOnInit() {
  }

}
