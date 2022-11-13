import { ToolFuncFormatTime, ToolFuncFormatTimeStr, TypeToolFuncDownTime } from './../../tools/functions/time';
import { interval } from 'rxjs';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent extends ToolClassAutoClosePipe implements OnInit {

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
  // 个人信息
  userInfo = {
    // 是否已关注
    followed: false,
  }
  // 竞价信息
  marketInfo = {
    // 最高价pc
    maxOutputPriceOfBaseToken: '1320',
    // 最高价美元
    maxOutputPriceOfDollar: '11234.12',
    // 竞拍结束时间
    closeTime: new Date(),
    // 卖家定价
    startPriceOfBaseToken: '1050',
    startPriceOfDollar: '122.2',
  };

  // 卖家定价
  sellerSet: {
    startPriceOfBaseToken: string,
    startPriceOfDollar: string,
    remainingDays: Date,
  }[] = [
    {
      startPriceOfBaseToken: '1050',
      startPriceOfDollar: '122.2',
      remainingDays: new Date(),
    }
  ];

  // 历史报价
  outputPriceList: {
    priceOfBaseToken: string,
    priceOfDollar: string,
    // 剩余天数
    remainingDays: string,
    // 报价用户
    user: {
      name: string,
      logo: string,
    }
  }[] = Array(10).fill(0).map(() => ({
    priceOfBaseToken: '1050',
    priceOfDollar: '298.21',
    remainingDays: '10',
    user: {
      name: 'other user',
      logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
    }
  }));

  // 交易历史
  marketHistoryList: {
    type: string, // 类型
    price: string, // 价格
    user: { // 操作用户
      name: string,
      logo: string,
    },
    time: string, // 过去时间
  }[] = Array(10).fill(0).map(() => ({
    type: '出价',
    price: '1223',
    time: '10',
    user: {
      name: 'other user',
      logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
    }
  }));

  // 更多推荐
  moreRecommend: {
    image: string,
    name: string,
    creator: string,
    id: string,
    price: string,
  }[] = Array(4).fill(0).map(() => ({
    image: '../../../assets/images/cache/home/矩形 5.png',
    creator: 'Dude',
    name: 'Geek Dude',
    id: '87534',
    price: '1223',
  }));

  // 倒计时时间对象
  downTimeData?: TypeToolFuncDownTime<string>;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super();
    this.#getProductIdByPath();
  }

  ngOnInit(): void {
    this.#getDownTime(1000000);
  }

  // 注册读取收藏品ID
  #getProductIdByPath() {
    this.route.paramMap.pipe(this.$pipeSwitch()).subscribe((input) => {
      if (input.has('id') && input.get('id') !== null) {
        this.productId = input.get('id')!;
      } else {
        this.location.back();
      }
    });
  }

  // 获取倒计时
  #getDownTime(time: number) {
    const timer = interval(1000).pipe(this.$pipeSwitch()).subscribe((didTime) => {
      const hadTime = time - didTime * 1000;
      if (hadTime <= 0) {
        timer.unsubscribe();
      } else {
        this.downTimeData = ToolFuncFormatTimeStr(hadTime);
      }
    });
  }

}
