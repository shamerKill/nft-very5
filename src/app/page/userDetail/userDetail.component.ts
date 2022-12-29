import { ClipboardService } from 'ngx-clipboard';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetService } from '../../server/net.service';
import { BaseMessageService } from '../../server/base-message.service';
import { StateService, accountStoreInit } from './../../server/state.service';
import { Router,NavigationEnd } from '@angular/router';
import * as dayjs from 'dayjs';

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
  BannerImageUrl:string,
  CollectionOriginal: {
    CollectionID: string, // id
    Name:string,
    Image: string
  };
  ImageUrl?:string;
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
  selector: 'app-user',
  templateUrl: './userDetail.component.html',
  styleUrls: ['./userDetail.component.scss']
})
export class UserDetailComponent implements OnInit,OnDestroy {
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
  filterChange(event:outputObj) {
    this.filterObj = event;
    if (this.tabActive == 0) {
      this.getNftList();
    } else if (this.tabActive == 1) {
      this.getNftList1();
    } else if (this.tabActive == 2) {
      this.getCollectionList();
    } else if (this.tabActive == 3) {
      this.getTransList();
    }
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
  transList: any[] = [];
  checkTab(i:number) {
    this.tabActive = i;
    if (this.tabActive == 0) {
      this.getNftList();
    } else if (this.tabActive == 1) {
      this.getNftList1();
    } else if (this.tabActive == 2) {
      this.getCollectionList();
    } else if (this.tabActive == 3) {
      this.getTransList();
    }
  };
  accountAddress:string = '';
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute,
    private clipboard: ClipboardService,
    public stateService: StateService,
    private router: Router,
  ) {
    this.stateService.linkedWallet$.pipe().subscribe(data => {
      if (data.accountAddress) this.accountAddress = data.accountAddress;
    });
  }
  userAddress: string='';
  navigationSubscription:any;
  ngOnInit(): void {
    this.userAddress = this.routerInfo.snapshot.queryParams['id'];
    this.getInfo();
    if (this.tabActive == 0) {
      this.getNftList();
    } else if (this.tabActive == 1) {
      this.getNftList1();
    } else if (this.tabActive == 2) {
      this.getCollectionList();
    } else if (this.tabActive == 3) {
      this.getTransList();
    }
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.userAddress = this.routerInfo.snapshot.queryParams['id'];
        if (this.routerInfo.snapshot.queryParams['type'] === 'collection') {
          this.checkTab(2);
        }
        this.getInfo();
        if (this.tabActive == 0) {
          this.getNftList();
        } else if (this.tabActive == 1) {
          this.getNftList1();
        } else if (this.tabActive == 2) {
          this.getCollectionList();
        } else if (this.tabActive == 3) {
          this.getTransList();
        }
      }
    });
  }
  ngOnDestroy():void{
    this.navigationSubscription.unsubscribe()
  }
  starNum:number=0;
  fouceNum:number=0;
  getInfo() {
    console.log(11)
    // 获取数据
    this.net.getUserInfo$(this.userAddress).pipe().subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      this.userInfo = data;
    });
    this.net.getUserStarList$().pipe().subscribe(data => {
      if (data.code === 200 && data.data && data.data.length) {
        this.starNum = data.data.length;
      }
    })
    this.net.getUserStarSellList$().pipe().subscribe(data => {
      if (data.code === 200 && data.data && data.data.length) {
        this.fouceNum = data.data.length;
      }
    })
  }
  getNftList() {
    this.net.getNftList$('',this.filterObj.cate,this.filterObj.sell,this.filterObj.low,this.filterObj.high,this.filterObj.coin,this.filterObj.search,this.sortObj.id,'',this.userAddress).pipe().subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.nftList = data
      } else {
        this.nftList = []
      }
    });
  }
  getNftList1() {
    this.net.getNftList$(this.userAddress,this.filterObj.cate,this.filterObj.sell,this.filterObj.low,this.filterObj.high,this.filterObj.coin,this.filterObj.search,this.sortObj.id,'',).pipe().subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.nftList = data
      } else {
        this.nftList = []
      }
    });
}
  getCollectionList() {
    this.net.getCollectionList$(this.userAddress,this.filterObj.cate).pipe().subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.exploreList = data;
      } else {
        this.exploreList = []
      }
    });
  }
  getTransList() {
    this.net.getUserTrans$('','',this.filterObj.sell,this.userAddress).pipe().subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.transList = data;
        this.transList.map(item => {
          item.UpdateTime = dayjs.unix(item.Created).format('YYYY-MM-DD')
        })
      } else {
        this.transList = []
      }
    });
  }
  refresh() {
    this.getInfo();
    if (this.tabActive == 0) {
      this.getNftList();
    } else if (this.tabActive == 1) {
      this.getNftList1();
    } else if (this.tabActive == 2) {
      this.getCollectionList();
    } else if (this.tabActive == 3) {
      this.getTransList();
    }
  }
  shareLink() {
    this.shareShow = !this.shareShow
  }
  chooseShare(i:number) {
    let nowUrl:string = window.location.href;
    if (i == 0) {
      this.clipboard.copy(nowUrl);
    } else if (i==1) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${nowUrl}`)
    } else if (i==2) {
      window.open(`https://twitter.com/intent/tweet?text=Check out this item on Very5&url=${nowUrl}&via=Plugchainclub`)
    }
    this.shareShow = false;
  }

  /**
   * 前往页面
   **/
  onGoToPage(page: string, queryParams?: {[key: string]: string}) {
    this.stateService.userMenuState$.next(false);
    this.router.navigate([page], { queryParams });
  }
}
