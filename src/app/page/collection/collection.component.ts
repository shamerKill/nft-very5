import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';

type sortItem = {name: string; id: string};
type CollectionOriginal = {
  CollectionID: string; // id
  Name:string;
  Image: string
  Description:string;
  Created:number;
  FeeRecipient:string;
  CreatedAt: string;
}
type CreatorAccount = {
  Name: string;
  ID: number;
}
type exploreItem = {
  BannerImageUrl:string;
  CollectionOriginal: CollectionOriginal;
  CreatorAccount:CreatorAccount;
  IsFocus:boolean;
  Category:string;
  AssetCount:string|number; // 资产总数量（包含的nft数量）"
  Topping:string|number; // ：置顶(数字越大比重越高）"
  SellNumber:string|number; // 售卖数量
  HaveNumber:string|number; // 持有者数量"
  TransactionAmount:string; // 总交易额"
  HoldersNumber:string|number; // 持有人数量
  LowestPrice:string; // 最低价
  HighestPrice:string; // 最高价
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
type shareItem = {
  label:string;
  icon: string
}
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent extends ToolClassAutoClosePipe implements OnInit {
  shareItems:shareItem[] = [
    {label: $localize`复制链接`, icon: 'pi pi-copy'},
    {label: $localize`Facebook`, icon: 'pi pi-facebook'},
    {label: $localize`Twitter`, icon: 'pi pi-twitter'},
  ]
  shareShow:boolean=false;
  sortList:sortItem[]=[
    {
      name: $localize`全部`,
      id: ''
    },{
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
  transList: any[] = [];
  collectionDetail: exploreItem = {
    BannerImageUrl:'',
    Category: '',
    CollectionOriginal: {
      CollectionID: '',
      Name:'',
      Image: '',
      Description:'',
      Created:0,
      FeeRecipient:'',
      CreatedAt: ''
    },
    CreatorAccount: {
      Name: '',
      ID: 0
    },
    IsFocus:false,
    AssetCount:'',
    Topping:'',
    SellNumber:'',
    HaveNumber:'',
    TransactionAmount:'',
    HoldersNumber:'',
    LowestPrice:'',
    HighestPrice:'',
  };
  showMore:boolean=false;
  clickMore() {
    this.showMore = !this.showMore;
  };
  tabbar:string[]=[
    $localize`收藏品`,
    $localize`交易历史`,
  ]
  tabActive:number=0;
  checkTab(i:number) {
    this.tabActive = i;
    if (this.tabActive == 0) {
      this.getNftList();
    } else {
      this.getTransList()
    }
  };
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute,
    private clipboard: Clipboard
  ) {
    super();
  }
  collectionId: string='';
  ngOnInit(): void {
    this.collectionId = this.routerInfo.snapshot.queryParams['id'];
    this.getInfo();
    this.getNftList();
    this.getTransList()
  }
  filterChange(event:outputObj) {
    console.log(event)
    this.filterObj = event;
    this.getNftList()
  }
  getInfo() {
    // 获取数据
    this.net.getCollectionDetail$(this.collectionId).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      this.collectionDetail = data;
      console.log(data)
    });
  }
  getNftList() {
    // 获取数据
    this.net.getNftList$('',this.filterObj.cate,this.filterObj.sell,this.filterObj.low,this.filterObj.high,this.filterObj.coin,this.filterObj.search,this.sortObj.id,this.collectionId).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.nftList = data
      }
    });
  }
  getTransList() {
    this.net.getUserTrans$(this.collectionId,'',this.filterObj.sell,'').pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.transList = data
      }
    });
  }
  refresh() {
    this.getInfo();
    this.getNftList();
  }
  // postAddFocus$
  focusCollection() {
    if (this.collectionDetail.IsFocus) {
      this.net.postDelFocus$(this.collectionId).subscribe(res => {
        if (res.code !== 200) return this.BaseMessage.warn(res.msg??'');
        if (res.code === 200) {
          this.BaseMessage.success($localize`收藏成功`);
          // 更新数据
          this.getInfo();
        }
      });
    } else {
      this.net.postAddFocus$(this.collectionId).subscribe(res => {
        if (res.code !== 200) return this.BaseMessage.warn(res.msg??'');
        if (res.code === 200) {
          this.BaseMessage.success($localize`取消成功`);
          // 更新数据
          this.getInfo();
        }
      });
    }
  }
  shareLink() {
    this.shareShow = !this.shareShow
  }
  chooseShare(i:number) {
    let nowUrl:string = window.location.href;
    if (i == 0) {
      this.clipboard.copy(nowUrl);
      this.BaseMessage.success($localize`复制成功`)
    } else if (i==1) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${nowUrl}`)
    } else if (i==2) {
      window.open(`https://twitter.com/intent/tweet?text=Check out this item on Very5&url=${nowUrl}&via=Plugchainclub`)
    }
    this.shareShow = false;
  }
}
