import { BaseMessageService } from './../../server/base-message.service';
import { NetService } from './../../server/net.service';
import { ToolFuncFormatTime, ToolFuncTimeToFormatBig, TypeToolFuncDownTime } from '../../tools/functions/time';
import { ToolClassAutoClosePipe } from '../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-nft',
  templateUrl: './my-star.component.html',
  styleUrls: ['./my-star.component.scss']
})
export class MyStarComponent extends ToolClassAutoClosePipe implements OnInit {

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
  }[] = [];
  // Array(4).fill(0).map((_, index) => ({
  //   id: `${index + 1}`,
  //   user: {
  //     logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
  //     name: 'BOOLEAN',
  //   },
  //   minPrice: '99,999',
  //   minPriceUnit: {
  //     name: 'PC',
  //     logo: '../../../assets/images/home/plug-logo.png'
  //   },
  //   chgInWeek: '-10.5%',
  //   chgInWeekDirection: false,
  //   chgInDay: '0.5%',
  //   chgInDayDirection: true,
  //   ownersNum: '294',
  //   productsNum: '1.3k',
  //   isFollow: true,
  // }));

  // 收藏品数据
  starTableData: {
    id: string;
    image: string;
    // 合集数据
    collectionInfo: {
      name: string;
      id: string;
    };
    // 作品名字
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
      showTime?: string;
    }
  }[] = [];
  // Array(5).fill(0).map((_, index) => ({
  //   id: `${index + 1}`,
  //   image: '../../../assets/images/cache/home/矩形 5.png',
  //   collectionInfo: {
  //     name: 'BUTTON',
  //     id: '12',
  //   },
  //   name: 'BUTTON SHOW',
  //   price: '9951',
  //   priceUnit: {
  //     name: 'PC',
  //     logo: '../../../assets/images/home/plug-logo.png'
  //   },
  //   isFollow: Math.random() < 0.5,
  //   auctionInfo: {
  //     inAuctioning: true,
  //     endTime: ToolFuncFormatTime(1000000),
  //     showTime: ToolFuncTimeToFormatBig(ToolFuncFormatTime(1000000)),
  //   }
  // }));

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
  }[] = [];
  // Array(4).fill(0).map((_, index) => ({
  //   id: `${index + 1}`,
  //   mainImage: '../../../assets/images/cache/home/矩形 5.png',
  //   bgImage: '../../../assets/images/explore/sb.jpeg',
  //   name: 'BUTTONS',
  //   describe: 'THIS IS BUTTONS',
  //   isFollow: true,
  // }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private net: NetService,
    private message: BaseMessageService,
  ) {
    super();
    this.getQueryData();
    this.getRemoteData();
  }

  ngOnInit(): void {
  }

  // 获取数据
  getRemoteData() {
    this.net.getUserStarList$().pipe(this.pipeSwitch$()).subscribe(data => {
      if (data.code === 200 && data.data && data.data.length) {
        this.starTableData = data.data.map((item: any) => {
          return {
            id: `${item.NftOriginal.NftID}`,
            image: item.NftOriginal.Image,
            collectionInfo: {
              name: item.CollectionName,
              id: `${item.CollectionID}`,
            },
            name: item.NftOriginal.Name,
            price: item.CurrentPrice,
            priceUnit: {
              name: 'PC',
              logo: '../../../assets/images/home/plug-logo.png',
            },
            isFollow: true,
            auctionInfo: {
              inAuctioning: item.SellingType === 2,
            }
          };
        });
      }
    });
    this.net.getUserStarSellList$().pipe(this.pipeSwitch$()).subscribe(data => {
      if (data.code === 200 && data.data && data.data.length) {
        this.collectionTableData = data.data.map((item: any) => {
          return {
            id: item.CollectionOriginal.CollectionID,
            mainImage: item.ImageUrl,
            bgImage: item.BannerImageUrl,
            name: item.CollectionOriginal.Name,
            describe: item.CollectionOriginal.Description,
            isFollow: true,
          };
        });
      }
    });
  }

  // 获取query数据
  getQueryData() {
    this.route.queryParams.pipe(this.pipeSwitch$()).subscribe((data) => {
      if (data['type'] === 'star') this.tabType = 0;
      if (data['type'] === 'follow') this.tabType = 1;
      if (data['type'] === 'collection') this.tabType = 2;
    });
  }

  // 切换tab
  onChangeTab(event: any) {
    let type = 'follow';
    if (event.index === 0) type = 'star';
    if (event.index === 1) type = 'follow';
    if (event.index === 2) type = 'collection';
    this.router.navigate(['my/star'], {
      queryParams: { type },
      queryParamsHandling: 'merge',
      replaceUrl: true,
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
  // 修改收藏品数据
  changeOwnData(item: any) {
    for (let i = 0; i < this.starTableData.length; i++) {
      if (this.starTableData[i].id === item.id) {
        let item = this.starTableData[i];
        if (item.isFollow) {
          this.net.putDelStar$('nft', item.id).subscribe(data => {
            if (data.code !== 200) {
              item.isFollow = true;
              return this.message.warn(data.msg??$localize`取消关注失败`);
            } else {
              item.isFollow = false;
              return this.message.success(data.msg??$localize`取消关注成功`);
            }
          });
        } else {
          this.net.putAddStar$('nft', item.id).subscribe(data => {
            if (data.code !== 200) {
              item.isFollow = false;
              return this.message.warn(data.msg??$localize`关注失败`);
            } else {
              item.isFollow = false;
              return this.message.success(data.msg??$localize`关注成功`);
            }
          });
        }
        item.isFollow = !item.isFollow;
        break;
      }
    }
  }
  // 修改合集数据
  changeCollectionData(item: any) {
    for (let i = 0; i < this.collectionTableData.length; i++) {
      if (this.collectionTableData[i].id === item.id) {
        let item = this.collectionTableData[i];
        if (item.isFollow) {
          this.net.putDelStar$('collection', item.id).subscribe(data => {
            if (data.code !== 200) {
              item.isFollow = true;
              return this.message.warn(data.msg??$localize`取消关注失败`);
            } else {
              item.isFollow = false;
              return this.message.success(data.msg??$localize`取消关注成功`);
            }
          });
        } else {
          this.net.putAddStar$('collection', item.id).subscribe(data => {
            if (data.code !== 200) {
              item.isFollow = false;
              return this.message.warn(data.msg??$localize`关注失败`);
            } else {
              item.isFollow = false;
              return this.message.success(data.msg??$localize`关注成功`);
            }
          });
        }
        item.isFollow = !item.isFollow;
        break;
      }
    }
  }

}
