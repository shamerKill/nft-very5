import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss']
})
export class RankingListComponent extends ToolClassAutoClosePipe implements OnInit {

  // 排行榜数据
  listData: {
    num: number; // 排序序号
    // 合集信息
    collection: {
      id: string; // id
      logo: string; // 合集logo
      name: string; // 合集名称
    };
    businessVolumeOfBaseToken: string; // 成交额
    chgRateInDay: string; // 24小时涨跌幅
    chgRateInWeek: string; // 7日涨跌幅
    middlePriceInDay: string; // 24小时内均价
    bottomPrice: string; // 最低价
    ownerVolume: string; // 持有者数量
    valuationOfNowTime: string; // 现总估值
  }[] = Array(100).fill(0).map((_, index) => ({
    num: index + 1,
    collection: {
      id: '',
      logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
      name: 'BAYCRom'
    },
    businessVolumeOfBaseToken: '3,032.098',
    chgRateInDay: '-102.13%',
    chgRateInWeek: '33.43%',
    middlePriceInDay: '3,032.098',
    bottomPrice: '1.3K',
    ownerVolume: '1.2K',
    valuationOfNowTime: '10K'
  }));

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  // 判断涨跌方向
  checkChgDirection(input: string) {
    const val = parseFloat(input);
    if (val < 0) return false;
    else return true;
  }

}
