import { Component, OnInit,ViewChild } from '@angular/core';
import '@angular/localize';
import SwiperCore, { Pagination } from "swiper";
import { ActivatedRoute } from '@angular/router';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';

SwiperCore.use([Pagination]);

type sortItem = {name: string; id: number};
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}[]
type NftOriginal= {
  Name: string; // nft名称
  NftID: string|number;
  Image: string; // nft图片
}
type nftItem = {
  Sellinglype:string; // 正在售卖类型（1：一口价,2拍卖）
  CollectionName: string; // 集合名称
  CollectionID: string|number;
  NftOriginal: NftOriginal;
  CurrentPrice: string|number;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends ToolClassAutoClosePipe implements OnInit {
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
  nftList: nftItem[] = [];
  listType:number=1;
  switchList(type:number) {
    this.listType = type;
  };
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute
  ) {
    super();
  }
  searchStr: string='';
  ngOnInit(): void {
    this.searchStr = this.routerInfo.snapshot.queryParams['id'];
    this.getList();
  }
  getList() {
    // 获取数据
    this.net.getSearchNftList$(this.searchStr).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      this.nftList = data
    });
    this.net.getSearchCollectionList$(this.searchStr).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      console.log(data)
    });
  }
}
