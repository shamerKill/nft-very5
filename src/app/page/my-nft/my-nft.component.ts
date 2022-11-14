import { TypeToolFuncDownTime } from './../../tools/functions/time';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-nft',
  templateUrl: './my-nft.component.html',
  styleUrls: ['./my-nft.component.scss']
})
export class MyNftComponent extends ToolClassAutoClosePipe implements OnInit {

  // 展示类型 follow/own/collection
  tabType: number = 0;

  // 关注数据
  followTableData: {
    id: string;
    // 用户信息
    user: {
      logo: string;
      name: string;
    };
    // 最低价
    minPrice: string;
    minPriceUnit: {
      name: string;
      logo: string;
    };
    chgInWeek: string;
    chgInWeekDirection: boolean;
    chgInDay: string;
    chgInDayDirection: boolean;
    ownersNum: string;
    productsNum: string;
    isFollow: boolean;
  }[] = Array(4).fill(0).map((_, index) => ({
    id: `${index + 1}`,
    user: {
      logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
      name: 'BOOLEAN',
    },
    minPrice: '99,999',
    minPriceUnit: {
      name: 'PC',
      logo: '../../../assets/images/home/plug-logo.png'
    },
    chgInWeek: '-10.5%',
    chgInWeekDirection: false,
    chgInDay: '0.5%',
    chgInDayDirection: true,
    ownersNum: '294',
    productsNum: '1.3k',
    isFollow: true,
  }));

  // 收藏品数据
  ownTableData: {
    id: string;
    // 合集数据
    collectionInfo: {
      name: string;
      id: string;
    };
    name: string;
    // 最后价格
    price: string;
    priceUnit: {
      name: string;
      logo: string;
    };
    isFollow: boolean;
    // 拍卖信息
    auctionInfo: {
      inAuctioning: boolean;
      endTime?: TypeToolFuncDownTime;
    }
  }[] = Array(5).fill(0).map(_ => ({
    id: '1',
    collectionInfo: {
      name: 'BUTTON',
      id: '12',
    },
    name: 'BUTTON SHOW',
    price: '9.9k',
    priceUnit: {
      name: 'PC',
      logo: '../../../assets/images/home/plug-logo.png'
    },
    isFollow: true,
    auctionInfo: {
      inAuctioning: false,
    }
  }));

  // 合集数据
  collectionTableData: {
    // id
    id: string;
    // 主图
    mainImage: string;
    // 背景图
    bgImage: string;
    // 名字
    name: string;
    // 描述
    describe: string;
    // 是否关注
    isFollow: boolean;
  }[] = Array(4).fill(0).map(_ => ({
    id: '1',
    mainImage: '../../../assets/images/home/plug-logo.png',
    bgImage: '../../../assets/images/home/plug-logo.png',
    name: 'BUTTONS',
    describe: 'THIS IS BUTTONS',
    isFollow: true,
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    super();
    this.getQueryData();
  }

  ngOnInit(): void {
  }

  // 获取query数据
  getQueryData() {
    this.route.queryParams.pipe(this.$pipeSwitch()).subscribe((data) => {
      if (data['type'] === 'follow') this.tabType = 0;
      if (data['type'] === 'own') this.tabType = 1;
      if (data['type'] === 'collection') this.tabType = 2;
    });
  }

  // 切换tab
  onChangeTab(event: any) {
    let type = 'follow';
    if (event.index === 0) type = 'follow';
    if (event.index === 1) type = 'own';
    if (event.index === 2) type = 'collection';
    this.router.navigate(['my/nft'], {
      queryParams: { type },
      queryParamsHandling: 'merge'
    });
  }

  // 修改关注数据
  changeFollowData(item: any) {
    for (let i = 0; i < this.followTableData.length; i++) {
      if (this.followTableData[i].id === item.id) {
        this.followTableData[i].isFollow = !this.followTableData[i].isFollow;
        break;
      }
    }
  }

}
