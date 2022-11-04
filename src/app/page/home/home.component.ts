import { DatabaseService } from './../../server/database.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, { Pagination } from "swiper";

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // 首屏card数据
  firstCards = {
    initiated: false,
    items: [
      {
        image: '../../../assets/images/cache/home/矩形 5.png',
        name: 'Geek Dude',
        owner: 'Dude',
        id: '87534',
      },
      {
        image: '../../../assets/images/cache/home/矩形 5.png',
        name: 'Geek Dude',
        owner: 'Dude',
        id: '87534',
      },
      {
        image: '../../../assets/images/cache/home/矩形 5.png',
        name: 'Geek Dude',
        owner: 'Dude',
        id: '87534',
      },
      {
        image: '../../../assets/images/cache/home/矩形 5.png',
        name: 'Geek Dude',
        owner: 'Dude',
        id: '87534',
      },
      {
        image: '../../../assets/images/cache/home/矩形 5.png',
        name: 'Geek Dude',
        owner: 'Dude',
        id: '87534',
      }
    ]
  }

  // 资产排行榜数据
  assetsRank: {
    index: number, // tab选项
    list: {
      title: string, // tab按钮标题
      data: {
        number: string, // 排序
        name: string, // 名字
        logo: string, // 用户logo
        assets: string, // 当前资产
        chgRate: string, // 涨跌幅
        direction: boolean, // 方向, true涨，false跌
        id: string, // id
      }[], // 列表数据
    }[],
  } = {
    index: 0,
    list: [
      {
        title: $localize`24小时`,
        data: Array(15).fill(0).map((_, index) => ({
          number: `${index + 1}`,
          name: 'hello world',
          logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          assets: '99000.09',
          chgRate: '20.989%',
          direction: true,
          id: '2012',
        }))
      },
      {
        title: $localize`7天`,
        data: Array(15).fill(0).map((_, index) => ({
          number: `${index + 1}`,
          name: 'hello world',
          logo: '../../../assets/images/cache/home/矩形 12 拷贝 3.png',
          assets: '99000.09',
          chgRate: '-20.989%',
          direction: false,
          id: '2012',
        }))
      },
      {
        title: $localize`30天`,
        data: Array(15).fill(0).map((_, index) => ({
          number: `${index + 1}`,
          name: 'hello world',
          logo: '../../../assets/images/cache/home/椭圆 3 拷贝.png',
          assets: '99000.09',
          chgRate: '20.989%',
          direction: true,
          id: '2012',
        }))
      }
    ],
  };

  // 艺术家数据
  artistList: {
    index: number, // tab选项
    list: {
      name: string, // 名字
      logo: string, // 用户logo
      favorite: boolean, // 是否被我收藏了
      collectionNum: number, // 收藏品数量
      ownerNum: number, // 持有者数量
      id: string, // id
      collectionList: {
        logo: string, // 用户logo
        id: string, // id
      }[] // 收藏品列表
    }[],
  } = {
    index: 0,
    list: [
      {
        name: 'SUPER JOJO 1',
        logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
        favorite: true,
        collectionNum: 200,
        ownerNum: 123,
        id: '8903',
        collectionList: [
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
        ]
      },
      {
        name: 'SUPER JOJO 2',
        logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
        favorite: false,
        collectionNum: 200,
        ownerNum: 123,
        id: '8903',
        collectionList: [
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
        ]
      },
      {
        name: 'SUPER JOJO 3',
        logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
        favorite: false,
        collectionNum: 200,
        ownerNum: 123,
        id: '8903',
        collectionList: [
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
        ]
      },
      {
        name: 'SUPER JOJO 4',
        logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
        favorite: false,
        collectionNum: 200,
        ownerNum: 123,
        id: '8903',
        collectionList: [
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
        ]
      },
      {
        name: 'SUPER JOJO 5',
        logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
        favorite: false,
        collectionNum: 200,
        ownerNum: 123,
        id: '8903',
        collectionList: [
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
          { logo: '../../../assets/images/cache/home/矩形 12 拷贝 2@2x.png', id: '123' },
        ]
      }
    ]
  };

  // 探索市场数据
  exploreMarket: {
    index: number, // tab选项
    list: {
      title: string, // tab按钮标题
      data: {
        ownerName: string, // 拥有者名字
        ownerLogo: string, // 拥有者logo
        image: string; // 资产
        id: string, // 编号
        name: string; // 名字
        price: string, // 价格
      }[], // 列表数据
    }[],
  } = {
    index: 0,
    list: [
      {
        title: $localize`热门`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`艺术`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`收藏品`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`虚拟世界`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`音乐`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`实用`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`体育`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`体育`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`体育`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`体育`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      },
      {
        title: $localize`体育`,
        data: Array(6).fill(0).map(() => ({
          ownerName: 'DuDuDu',
          ownerLogo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
          image: '../../../assets/images/cache/home/矩形 5.png',
          name: 'hello world',
          id: '2012',
          price: '20123.12',
        }))
      }
    ],
  };

  constructor(
    public dataBase: DatabaseService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  // 更改资产排行榜tab
  onChangeAssetsRankIndex(index: number) {
    if (index < 0) {
      this.assetsRank.index = 0;
    } else if (index >= this.assetsRank.list.length - 1) {
      this.assetsRank.index = this.assetsRank.list.length - 1;
    } else {
      this.assetsRank.index = index;
    }
  }

  // 更改探索市场tab
  onChangeExploreMarketIndex(index: number) {
    if (index < 0) {
      this.exploreMarket.index = 0;
    } else if (index >= this.exploreMarket.list.length - 1) {
      this.exploreMarket.index = this.exploreMarket.list.length - 1;
    } else {
      this.exploreMarket.index = index;
    }
  }


}
