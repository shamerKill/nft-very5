import { Component, OnInit } from '@angular/core';
type UnitItem = {name: string,logo:string,id:number}[]
@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
})
export class FilterBoxComponent implements OnInit {
  constructor() { }
  stateState: boolean = false;
  changeState() {
    this.stateState = !this.stateState;
  };
  stateList: Array<string> = [
    '立即购买',
    '拍卖中',
    '有出价',
  ]
  stateIndex:number = 0;
  changeStateIndex(index:number) {
    this.stateIndex = index;
  };
  priceState: boolean = false;
  changePrice() {
    this.priceState = !this.priceState;
  };
  PriceUnit:UnitItem=[
    {
      name: 'USD',
      logo: '../../../assets/images/explore/usd.png',
      id: 1
    },{
      name: 'PC',
      logo: '../../../assets/images/explore/pc.png',
      id: 2
    }
  ];
  PriceSelect: number = 0;
  numState: boolean = false;
  minPrice: number|string = '';
  maxPrice: number|string = '';
  priceSearch: boolean = false;
  submitSearch() {
    this.priceSearch = true;
    setTimeout(() => this.priceSearch = false, 1000);
  };
  changeNum() {
    this.numState = !this.numState;
  };
  ngOnInit(): void {
  }

}
