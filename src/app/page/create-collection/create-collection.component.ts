import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {

  tokens: {name: string}[];
  types: {name: string}[];


  constructor() {
    this.tokens = [
      {name: 'PLUG'},
      {name: 'PUSD'},
    ];
    this.types = [
      {name: 'AAAA'},
      {name: 'BBBB'},
    ];
  }

  ngOnInit(): void {
  }

}
