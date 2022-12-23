import { Component, OnInit, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { nftTypesArr } from './../../server/database.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
type UnitItem = {name: string;logo:string;id:number;contract:string;}
type chooseItem = {
  name:string;
  id: string;
  checked: boolean
}
type outputObj = {
  sell: string;
  cate: string;
  low: string|number;
  high: string|number;
  coin: string;
  search: string;
}
@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
})
export class FilterBoxComponent extends ToolClassAutoClosePipe implements OnInit,OnChanges {
  constructor(
    private message: BaseMessageService,
    private net: NetService,
  ) { 
    super()
  }
  @Input() collectionType?:number;
  @Output() change: EventEmitter<outputObj> = new EventEmitter<outputObj>();
  newFilterObj:outputObj = {
    sell: '',
    cate: '',
    low: '',
    high: '',
    coin: '',
    search: '',
  };
  setChange() {
    let stateArr:Array<string> = [];
    if(this.collectionType ==2) {
      this.collectionTypeList.map(item => {
        if (item.checked) {
          stateArr.push(item.id)
        }
      })
    } else {
      this.stateList.map(item => {
        if (item.checked) {
          stateArr.push(item.id)
        }
      })
    }
    let cateArr:Array<string> = [];
    this.classList.map(item => {
      if (item.checked) {
        cateArr.push(item.id)
      }
    })
    this.newFilterObj = {
      sell: stateArr.join(','),
      cate: cateArr.join(','),
      low: this.minPrice,
      high: this.maxPrice,
      coin: this.PriceSelect?this.PriceSelect.contract:'',
      search: this.searchName,
    }
    console.log(this.newFilterObj)
    this.change.emit(this.newFilterObj);
  }
  showMore: boolean = true;
  showFilterMenu() {
    this.showMore = !this.showMore;
  }
  stateState: boolean = false;
  changeState() {
    this.stateState = !this.stateState;
  };
  stateList: chooseItem[] = [
    {
      name: '立即购买',
      id: '1',
      checked:false
    },{
      name: '拍卖中',
      id: '2',
      checked:false
    },{
      name: '有出价',
      id: '3',
      checked:false
    }
  ]
  collectionTypeList: chooseItem[] = [
    {
      name: '新的拍卖',
      id: 'create',
      checked:false
    },{
      name: '销售',
      id: 'successful',
      checked:false
    },{
      name: '职消的拍卖',
      id: 'cancelled',
      checked:false
    }
  ]
  collectionTypeState: boolean = false;
  changeCollectionType() {
    this.collectionTypeState = !this.collectionTypeState;
  };
  changeStateIndex(index:number) {
    this.stateList[index].checked = !this.stateList[index].checked;
    this.setChange();
  };
  classState: boolean = false;
  changeClass() {
    this.classState = !this.classState;
  };
  classList: chooseItem[] = nftTypesArr.map(item => ({
    name:item.title,
    id: item.key,
    checked:false
  }))
  changeClassIndex(index:number) {
    this.classList[index].checked = !this.classList[index].checked
    this.setChange();
  };
  changeCollectionIndex(index:number) {
    this.collectionTypeList[index].checked = !this.collectionTypeList[index].checked
    this.setChange();
  };
  priceState: boolean = false;
  changePrice() {
    this.priceState = !this.priceState;
  };
  PriceUnit:UnitItem[]=[];
  PriceSelect: UnitItem={
    name: '',
    logo: '',
    id: 0,
    contract: ''
  };
  getTokenList() {
    this.net.getPayTokenList$(1).pipe(this.pipeSwitch$()).subscribe(data => {
      if (data.code === 200 && data.data && data.data.length) {
        this.PriceUnit = data.data.map((item:{Decimals:number;ID:number;Logo:string;Name:string;Token:string;}) => ({
          name: item.Name,
          logo:item.Logo,
          id:item.ID,
          contract: item.Token
        }))
        console.log(this.PriceUnit)
      }
    })
  }
  numState: boolean = false;
  minPrice: number|string = '';
  maxPrice: number|string = '';
  priceSearch: boolean = false;
  searchState: boolean = false;
  changeSearch() {
    this.searchState = !this.searchState;
  };
  searchName: string = '';

  submitSearch() {
    this.setChange();
    this.priceSearch = true;
    setTimeout(() => this.priceSearch = false, 1000);
  };
  submitSearch1() {
    this.setChange();
    this.priceSearch = true;
    setTimeout(() => this.priceSearch = false, 1000);
  }
  changeNum() {
    this.numState = !this.numState;
  };
  ngOnInit(): void {
    this.getTokenList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
}
