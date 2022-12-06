import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
type UnitItem = {name: string;logo:string;id:number}
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
export class FilterBoxComponent implements OnInit {
  constructor() { }
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
      coin: this.PriceSelect.name,
      search: this.searchName,
    }
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
  classList: chooseItem[] = [
    {
      name: $localize`热门`,
      id: '热门',
      checked:false
    },
    {
      name: $localize`最佳`,
      id: '最佳',
      checked:false
    },
    {
      name: $localize`艺术`,
      id: '艺术',
      checked:false
    },
    {
      name: $localize`收藏品`,
      id: '收藏品',
      checked:false
    },
    {
      name: $localize`实用`,
      id: '实用',
      checked:false
    },
    {
      name: $localize`卡片`,
      id: '卡片',
      checked:false
    },
    {
      name: $localize`虚拟世界`,
      id: '虚拟世界',
      checked:false
    },
    {
      name: $localize`音乐`,
      id: '音乐',
      checked:false
    },
    {
      name: $localize`体育`,
      id: '体育',
      checked:false
    },
    {
      name: $localize`域名`,
      id: '域名',
      checked:false
    },
  ]
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
  PriceUnit:UnitItem[]=[
    {
      name: 'PC',
      logo: '../../../assets/images/explore/pc.png',
      id: 2
    },
    {
      name: 'USD',
      logo: '../../../assets/images/explore/usd.png',
      id: 1
    }
  ];
  PriceSelect: UnitItem={
    name: '',
    logo: '',
    id: 0
  };
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
    this.priceSearch = true;
    setTimeout(() => this.priceSearch = false, 1000);
  };
  changeNum() {
    this.numState = !this.numState;
  };
  ngOnInit(): void {
  }

}
