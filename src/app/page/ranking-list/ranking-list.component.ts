import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';
import { NetService } from './../../server/net.service';
import { StateService } from './../../server/state.service';
import { Router } from '@angular/router';

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
    chgRateInMonth: string; // 30日涨跌幅
    middlePriceInDay: string; // 24小时内均价
    bottomPrice: string; // 最低价
    ownerVolume: string; // 持有者数量
    valuationOfNowTime: string; // 现总估值
    HighestPrice: string; // 最高价
  }[] = [];

  constructor(
    private router: Router,
    private state: StateService,
    private net: NetService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getList();
  }
  getList() {
    this.state.globalLoadingSwitch(true);
    this.net.getRankList$().pipe(this.pipeSwitch$()).subscribe(result => {
      this.state.globalLoadingSwitch(false);
      this.listData = [];
      if (result.code === 200 && result.data && result.data.length) {

        this.listData = result.data.map((item: any,index:number) => {
          return {
            num: index + 1,
            collection: {
              id: item.NftOriginal.NftID,
              logo: item.NftOriginal.Image,
              name: item.NftOriginal.Name
            },
            businessVolumeOfBaseToken: item.TransactionAmount,
            chgRateInDay: item.DayIncrease,
            chgRateInWeek: item.WeekIncrease,
            chgRateInMonth: item.MonthIncrease,
            middlePriceInDay: item.CurrentPrice,
            bottomPrice: item.LowestPrice,
            HighestPrice: item.HighestPrice,
          }
        })
      }
    })
  }
  // 判断涨跌方向
  checkChgDirection(input: string) {
    const val = parseFloat(input);
    if (val < 0) return false;
    else return true;
  }
  changePrenp(input: string) {
    return parseFloat(Number(input).toFixed(2))
  }
}
