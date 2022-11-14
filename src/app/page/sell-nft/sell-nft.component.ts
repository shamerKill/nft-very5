import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.scss']
})
export class SellNftComponent implements OnInit {
  // 付款代币列表
  buyTokens: {name: string}[] = [
    {name: 'PLUG'},
    {name: 'PUSD'},
  ];
  // 日期列表
  dayList: {name: string}[] = [
    {name: $localize`1 天`},
    {name: $localize`3 天`},
    {name: $localize`7 天`},
    {name: $localize`1 个月`},
    {name: $localize`3 个月`},
    {name: $localize`6 个月`},
    {name: $localize`自定义`},
  ];

  // 收藏品ID
  productId: string = '';
  // nft信息
  productInfo = {
    image: '../../../assets/images/cache/home/矩形 5.png',
    name: 'Geek Dude',
    owner: 'Dude',
    id: '87534',
    describe: 'Honorary members of the Bored Ape Yacht Club.',
    // 收藏者数量
    followerVol: 100,
    // 创建者
    creator: {
      name: 'BAYCTRONICS',
      logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
    },
    // 创建者抽成
    incomeRate: '0.1%',
    // 所在合集
    collection: {
      name: 'NEW COLLECTION',
      describe: 'Honorary members of the Bored Ape Yacht Club.',
      id: '123',
    },
    // 上链信息
    infoInChain: {
      contractAddress: 'gx1gjxs8ygvlur2cekxajdnhkl4tkf2vl478w3ew0',
      tokenId: '12394',
      sourceData: 'lkxczjvoiasjdf;laksjdgoasidjglksajvkljxzcovkjoiasjglkasjdgiojqwiejklasjvioasfj',
    }
  };

  // 出售类型 fixed / float
  sellType: string = 'float';
  // 选择的代币
  selectedBuyToken = [this.buyTokens[0]];
  // 初始价格
  startPrice: string = '';
  // 持续时间
  sellTimeLine = [this.dayList[0]];
  // 是否开启捆绑销售
  bundleSale = true;
  // 是否为特定卖家预留
  designatedBuyer = true;


  constructor(
    public location: Location,
  ) { }

  ngOnInit(): void {
  }

  // 切换类型
  onChangeSellType(type: string) {
    this.sellType = type;
  }
  // 修改价格单位
  changeBuyToken(event: any) {
    this.selectedBuyToken = [event.itemValue];
  }
  // 修改持续时间
  changeSellTimeLine(event: any) {
    this.sellTimeLine = [event.itemValue];
  }

}
