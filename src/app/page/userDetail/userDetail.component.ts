import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetService } from '../../server/net.service';
import { BaseMessageService } from '../../server/base-message.service';
import { ToolClassAutoClosePipe } from '../../tools/classes/pipe-close';

type sortItem = {name: string; id: string};
type userInfo = {
  Address: string; // id
  Avator:string;
  Collect: string
  Description:string;
  CollectedNft:number;
  Collection:number;
  CreateNft:number;
  Conver:string;
  CreatedAt: string;
  FocusCollection:number;
  Name: string;
  OwnerNft:number;
}
type exploreItem = {
  BannerImageUrl:string;
  IsFocus:boolean;
  Category:string;
}

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
type outputObj = {
  sell: string;
  cate: string;
  low: string|number;
  high: string|number;
  coin: string;
  search: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './userDetail.component.html',
  styleUrls: ['./userDetail.component.scss']
})
export class UserDetailComponent extends ToolClassAutoClosePipe implements OnInit {
  
  sortList:sortItem[]=[
    {
      name: $localize`最近转移`,
      id: '1'
    },{
      name: $localize`最近上架`,
      id: '2'
    },{
      name: $localize`最近创建`,
      id: '3'
    },{
      name: $localize`最近卖出`,
      id: '4'
    },{
      name: $localize`最近结束`,
      id: '5'
    },{
      name: $localize`价格：从低到高`,
      id: '6'
    },{
      name: $localize`价格：从高到底`,
      id: '7'
    },{
      name: $localize`销售最高`,
      id: '8'
    }
  ];
  nftList: nftItem[] = [];
  sortObj:sortItem={
    name: '',
    id: ''
  };
  listType:number=1;
  switchList(type:number) {
    this.listType = type;
  };
  filterObj:outputObj = {
    sell: '',
    cate: '',
    low: '',
    high: '',
    coin: '',
    search: '',
  }
  filterChange(event:outputObj) {
    this.filterObj = event;
    this.getNftList
  }
  exploreList: exploreItem[] = [];
  userInfo: userInfo = {
    Address: '',
    Avator:'',
    Collect: '',
    Description:'',
    CollectedNft:0,
    Collection:0,
    CreateNft:0,
    Conver:'',
    CreatedAt: '',
    FocusCollection:0,
    Name: '',
    OwnerNft:0,
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
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute
  ) {
    super();
  }
  collectionId: string='';
  ngOnInit(): void {
    this.collectionId = this.routerInfo.snapshot.queryParams['id'];
    this.getList();
    this.getNftList();
  }
  getList() {
    // 获取数据
    this.net.getNowUserInfo$().pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      console.log(data)
      this.userInfo = data.info;
    });
  }
  getNftList() {
    // 获取数据
    this.net.getNftList$('',this.filterObj.cate,this.filterObj.sell,this.filterObj.low,this.filterObj.high,this.filterObj.coin,this.filterObj.search,this.sortObj.id,this.collectionId).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      this.nftList = data
    });
  }

}
