import { Component, OnInit } from '@angular/core';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { StateService } from './../../server/state.service';
import '@angular/localize';
interface pageObj {
  first: number,
  page: number,
  pageCount: number,
  rows: number,
}

type sortItem = {name: string; id: string};
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
type filterObj = {
  sell: string;
  cate: string;
  low: string|number;
  high: string|number;
  coin: string;
  search: string;
}
@Component({
  selector: 'app-allNft',
  templateUrl: './allNft.component.html',
  styleUrls: ['./allNft.component.scss']
})
export class AllNftComponent extends ToolClassAutoClosePipe implements OnInit {
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
  public total!: number;
  public page!: number;
  public pageSize!: number;
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private state: StateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.state.globalLoadingSwitch(true);
    this.getNftList();
  }
  paginate(e:pageObj){
    this.pageSize = e.rows;
    this.page = e.page+1;
    this.state.globalLoadingSwitch(true);
    this.getNftList();
  }
  filterChange(event:filterObj) {
    this.filterObj = event;
    this.state.globalLoadingSwitch(true);
    this.getNftList();
  }
  getNftList() {
    // 获取数据
    this.net.getNftListNew$('',this.filterObj.cate,this.filterObj.sell,this.filterObj.low,this.filterObj.high,this.filterObj.coin,this.filterObj.search,this.sortObj.id,'','',this.page,this.pageSize).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      this.state.globalLoadingSwitch(false);
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data.nfts) && data.nfts.length) {
        this.nftList = data.nfts
        this.total = data.count
      } else {
        this.nftList = []
      }
    });
  }
}
