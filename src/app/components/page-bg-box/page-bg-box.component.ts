import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-bg-box',
  templateUrl: './page-bg-box.component.html',
  styleUrls: ['./page-bg-box.component.scss']
})
export class PageBgBoxComponent implements OnInit {

  @Input()
  class?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
