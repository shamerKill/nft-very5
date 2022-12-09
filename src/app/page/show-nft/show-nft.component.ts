import { NetService } from './../../server/net.service';
import { StateService } from './../../server/state.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-nft',
  templateUrl: './show-nft.component.html',
  styleUrls: ['./show-nft.component.scss']
})
export class ShowNftComponent extends ToolClassAutoClosePipe implements OnInit {

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


  // 买家报价
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

  constructor(
    private route: ActivatedRoute,
    private state: StateService,
    private net: NetService,
  ) {
    super();
    this.route.params.pipe(this.pipeSwitch$()).subscribe(({id}) => {
      this.productId = id;
      this.getNftInfo();
    });
  }

  ngOnInit(): void {
  }

  // 获取nft信息
  getNftInfo() {
    this.state.globalLoadingSwitch(true);
    this.net.getNftInfoById$(this.productId).subscribe(data => {
      console.log(data);
    });
  }

}
