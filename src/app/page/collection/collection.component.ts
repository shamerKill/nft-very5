import { Component, OnInit } from '@angular/core';

type sortItem = {name: string; id: number};
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}[]

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  sortList:sortItem[]=[
    {
      name: $localize`最近转移`,
      id: 1
    },{
      name: $localize`最近上架`,
      id: 2
    },{
      name: $localize`最近创建`,
      id: 3
    },{
      name: $localize`最近卖出`,
      id: 4
    },{
      name: $localize`最近结束`,
      id: 5
    },{
      name: $localize`价格：从低到高`,
      id: 6
    },{
      name: $localize`价格：从高到底`,
      id: 7
    },{
      name: $localize`销售最高`,
      id: 8
    }
  ];
  exploreList: exploreItem = [
    {
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb.jpeg',
      id: '1'
    },{
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb1.jpeg',
      id: '2'
    }
  ];
  listType:number=1;
  switchList(type:number) {
    this.listType = type;
  };
  showMore:boolean=false;
  clickMore() {
    this.showMore = !this.showMore;
  };
  tabbar:string[]=[
    $localize`收藏品`,
    $localize`创建的`,
    $localize`合集`,
    $localize`交易历史`,
  ]
  tabActive:number=0;
  checkTab(i:number) {
    this.tabActive = i;
  };
  constructor() { }

  ngOnInit(): void {
  }

}
