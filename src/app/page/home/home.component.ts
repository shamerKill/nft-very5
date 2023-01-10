import { BehaviorSubject } from 'rxjs';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { NetService } from './../../server/net.service';
import { DatabaseService, nftTypesArr } from './../../server/database.service';
import { Component, OnInit } from '@angular/core';
import SwiperCore, { Pagination } from "swiper";

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends ToolClassAutoClosePipe implements OnInit {
  // 首屏card数据
  firstCards: {
    initiated: boolean;
    items: {
      image: string;
      name: string;
      collectionName: string;
      id: string;
      ID:number;
    }[];
} = {
    initiated: false,
    items: []
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
        DayIncrease: string,
        WeekIncrease: string,
        MonthIncrease: string,
        id: string, // id
      }[], // 列表数据
    }[],
  } = {
    index: 0,
    list: [
      {
        title: $localize`24小时`,
        data: []
      },
      {
        title: $localize`7天`,
        data: []
      },
      {
        title: $localize`30天`,
        data: []
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
      nftList: {
        logo: string, // 用户logo
        id: string, // id
      }[] // 收藏品列表
    }[],
  } = {
    index: 0,
    list: []
  };

  // 探索市场数据
  exploreMarket: {
    index: BehaviorSubject<number>, // tab选项
    list: {
      title: string, // tab按钮标题
      key: string; // 接口调用值
      loaded: boolean; // 是否加载中
      data: {
        collectionName: string, // 合集名字
        sellType: number, // 售卖方式/1售卖|2拍卖
        image: string; // 资产
        id: string, // 编号
        name: string; // 名字
        price: string, // 价格
      }[], // 列表数据
    }[],
  } = {
    index: new BehaviorSubject(0),
    list: nftTypesArr.map(item => ({
      ...item,
      loaded: false,
      data: []
    })),
  };

  constructor(
    public dataBase: DatabaseService,
    private net: NetService,
    private BaseMessage: BaseMessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    // 获取数据
    this.net.getHomeData$().pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      this.formatTopData(data.top);
      this.formatAssertRanking(data.ranking);
      this.formatArtist(data.artist);
    });
    // 监听探索市场数据
    this.exploreMarket.index.pipe(this.pipeSwitch$()).subscribe(this.getExploreData.bind(this));
  }

  // 处理顶部数据
  private formatTopData(input: any[]) {
    this.firstCards.initiated = true;
    this.firstCards.items = input.map(item => ({
      image: item.NftOriginal.Image,
      name: item.NftOriginal.Name,
      collectionName: item.CollectionName,
      id: item.NftOriginal.NftID,
      ID: item.ID,
    }));
  }
  // 处理资产排行
  private formatAssertRanking(input: any) {
    const _doMap = (item: any, index: number) => {
      return {
        number: index + 1,
        name: item.NftOriginal.Name,
        logo: item.NftOriginal.Image,
        assets: item.CurrentPrice,
        DayIncrease: parseFloat(Number(item.DayIncrease).toFixed(2)),
        WeekIncrease: parseFloat(Number(item.WeekIncrease).toFixed(2)),
        MonthIncrease: parseFloat(Number(item.MonthIncrease).toFixed(2)),
        id: item.NftOriginal.NftID,
      };
    };
    this.assetsRank.list[0].data = input.dayRanking.map(_doMap);
    this.assetsRank.list[1].data = input.weekRanking.map(_doMap);
    this.assetsRank.list[2].data = input.monthRanking.map(_doMap);
  }
  // 顶级合集
  private formatArtist(input: any) {
    this.artistList.list = input.map((item: any) => ({
      name: item.CollectionOriginal.Name||'',
      logo: item.ImageUrl,
      favorite: item.IsFocus || false,
      collectionNum: item.AssetCount,
      ownerNum: item.HaveNumber,
      id: item.ID,
      nftList: item.Nfts.map((nft: any) => ({
        logo: nft.NftOriginal.Image,
        id: nft.NftOriginal.NftID
      }))
    }));
    if (this.artistList.list.length > 2) this.artistList.index = 1;
  }
  // 获取探索市场数据
  getExploreData(input: number) {
    const key = this.exploreMarket.list[input].key;
    this.net.getNefListByFilter$({category: key=='热门'?'':key, hot: key=='热门'?'1':''}).pipe(this.pipeSwitch$()).subscribe(data => {
      this.exploreMarket.list[input].loaded = true;
      if (data.code === 200 && data.data) {
        this.exploreMarket.list[input].data = data.data.map((item: any) => ({
          collectionName: item.CollectionName,
          sellType: item.sellingType,
          image: item.NftOriginal.Image,
          id: item.NftOriginal.NftID,
          name: item.NftOriginal.Name,
          price: item.CurrentPrice,
        }));
      }
    });
  }

  /**
   * 更改资产排行榜tab
   **/
  onChangeAssetsRankIndex(index: number) {
    if (index < 0) {
      this.assetsRank.index = 0;
    } else if (index >= this.assetsRank.list.length - 1) {
      this.assetsRank.index = this.assetsRank.list.length - 1;
    } else {
      this.assetsRank.index = index;
    }
  }

  /**
   * 更改探索市场tab
   **/
  onChangeExploreMarketIndex(index: number) {
    if (index < 0) {
      this.exploreMarket.index.next(0);
    } else if (index >= this.exploreMarket.list.length - 1) {
      this.exploreMarket.index.next(this.exploreMarket.list.length - 1);
    } else {
      this.exploreMarket.index.next(index);
    }
  }
  changeOwnData(item:any,index:number) {
    if (item.favorite) {
      this.net.putDelStar$('collection', item.id).subscribe(data => {
        if (data.code !== 200) {
          item.favorite = true;
          this.BaseMessage.warn(data.msg??$localize`取消收藏失败`);
        } else {
          item.favorite = false;
          this.BaseMessage.success(data.msg??$localize`取消收藏成功`);
          this.artistList.list[index] = item;
        }
      });
    } else {
      this.net.putAddStar$('collection', item.id).subscribe(data => {
        if (data.code !== 200) {
          item.favorite = false;
          this.BaseMessage.warn(data.msg??$localize`收藏失败`);
        } else {
          item.favorite = true;
          this.BaseMessage.success(data.msg??$localize`收藏成功`);
          this.artistList.list[index] = item;
        }
      });
    }
  }
  getDirection(input:string) {
    return parseFloat(input) >= 0;
  }
}
