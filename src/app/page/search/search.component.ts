import { Component, OnInit,ViewChild } from '@angular/core';
import '@angular/localize';
import SwiperCore, { Pagination } from "swiper";

SwiperCore.use([Pagination]);

type sortItem = {name: string; id: number};
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}[]

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
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
    },{
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb1.jpeg',
      id: '2'
    },{
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb1.jpeg',
      id: '2'
    },{
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb1.jpeg',
      id: '2'
    },{
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb1.jpeg',
      id: '2'
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
  constructor() {
  }

  ngOnInit(): void {
  }

}
