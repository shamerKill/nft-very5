import { ManipulateType } from './../../../../node_modules/dayjs/esm/index.d';
import { BaseMessageService } from './../../server/base-message.service';
import { StateService } from './../../server/state.service';
import { combineLatest } from 'rxjs';
import { NetService } from './../../server/net.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { formatDate, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { ToolFuncWalletSign } from 'src/app/tools/functions/wallet';

@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.scss']
})
export class SellNftComponent extends ToolClassAutoClosePipe implements OnInit {
  /**
   * 账户地址
   **/
  userInfoAddress = '';
  // 付款代币列表
  buyTokens: {
    name: string;
    minLen: number;
    logo: string;
    token: string;
  }[] = [];
  // 日期列表
  dayList: {name: string, num: number, unit: ManipulateType}[] = [
    {name: $localize`1 天`, num: 1, unit: 'd'},
    {name: $localize`3 天`, num: 3, unit: 'd'},
    {name: $localize`7 天`, num: 7, unit: 'd'},
    {name: $localize`1 个月`, num: 1, unit: 'M'},
    {name: $localize`3 个月`, num: 3, unit: 'M'},
  ];

  // 收藏品ID
  productId: string = '';
  // nft信息
  productInfo: Partial<{
    image: string;
    name: string;
    id: string;
    describe: string;
    followerVol: number; // 收藏者数量
    ownerNum: number; // 拥有者数量
    myNum: number; // 已拥有数量
    createdNum: number; // 发行数量
    creator: { // 创建者
      name: string;
      avatar: string;
      address: string;
    },
    attributes: {key: string, value: string}[]; // 属性列表
    incomeRate: string; // 创建者抽成
    systemRate: string; // 系统抽成
    collection: { // 合集信息
      name: string;
      describe: string;
      id: string;
    };
    infoInChain: { // 上链信息
      contractAddress: string; // 合约地址
      tokenId: string; // 代币id
      sourceData: string; // 原始数据
    }
  }> = {};

  // 出售类型 fixed / float
  sellType: string = 'fixed';
  // 选择的代币
  selectedBuyToken: {
    name: string;
    minLen: number;
    logo: string;
    token: string;
  }[] = [];
  // 初始价格
  startPrice: string = '';
  // 持续时间
  sellTimeLine = [this.dayList[0]];
  // 是否开启捆绑销售
  bundleSale = false;
  // 是否为特定卖家预留
  designatedBuyer = false;
  // 预留卖家
  fixedBuyer = '';
  // 出售数量
  sellNumber = 1;
  // 获取代币列表页数
  tokenListPage = 1;
  tokenListLoading = false;


  constructor(
    public location: Location,
    private net: NetService,
    private route: ActivatedRoute,
    private state: StateService,
    private message: BaseMessageService,
  ) {
    super();
    combineLatest([
      this.route.params,
      this.state.linkedWallet$,
    ]).pipe(
      this.pipeSwitch$(),
    ).subscribe(([params, wallet]) => {
      if (wallet.isLinking === false) {
        this.productId = params['id'];
        this.userInfoAddress = wallet.accountAddress??'';
        this.getNftInfo();
      }
    });
  }

  ngOnInit(): void {
  }


  // 获取nft数据
  getNftInfo() {
    this.state.globalLoadingSwitch(true);
    this.net.getNftInfoById$(this.productId, this.userInfoAddress).pipe(this.pipeSwitch$()).subscribe(result =>{
      this.state.globalLoadingSwitch(false);
      if (result.code !== 200) {
        this.location.back();
        this.message.warn($localize`获取数据失败`);
        return;
      } else {
        const data = result.data;
        this.productInfo.image = data.nft.NftOriginal.Image;
        this.productInfo.name = data.nft.NftOriginal.Name;
        this.productInfo.id = data.nft.NftOriginal.NftID;
        this.productInfo.describe = data.nft.NftOriginal.Description;
        this.productInfo.collection = {
          name: data.nft.CollectionName,
          id: data.nft.CollectionID,
          describe: '',
        };
        this.productInfo.createdNum = data.nft.CreatorNumber;
        this.productInfo.followerVol = data.collectPeople;
        this.productInfo.ownerNum = data.havePeople;
        this.checkNftOwner(data.nft.HaveNfts);
        this.getTransferFee(data.nft.CollectionID);
        this.getCollectionInfo(data.nft.CollectionID);
      }
    });
  }

  /**
   * 合集数据
   **/
  getCollectionInfo(id: string) {
    this.state.globalLoadingSwitch(true);
    this.net.getCollectionDetail$(id).pipe(this.pipeSwitch$()).subscribe(result => {
      this.state.globalLoadingSwitch(false);
      if (result.code === 200) {
        if (result.data.AllowToken) {
          try {
            this.buyTokens = JSON.parse(result.data.AllowToken);
            if (this.buyTokens.length) {
              this.selectedBuyToken = [this.buyTokens[0]];
            }
          } catch (_) {}
        }
      }
    });
  }

  // 获取交易费用
  getTransferFee(collectionId: string) {
    this.state.globalLoadingSwitch(true);
    this.net.getSellFee$(collectionId).pipe(this.pipeSwitch$()).subscribe(result => {
      this.state.globalLoadingSwitch(false);
      if (result.code !== 200) {
        this.location.back();
        this.message.warn($localize`获取数据失败`);
        return;
      } else {
        this.productInfo.incomeRate = (result.data.basis_points / 100).toFixed(2) + '%';
        this.productInfo.systemRate = (result.data.sys_basis_points / 100).toFixed(2) + '%';
      }
    });
  }

  // 判断用户是否拥有nft
  checkNftOwner(data: any) {
    if (data && Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].Owner === this.userInfoAddress) {
          this.productInfo.myNum = data[i].Value;
        }
      }
    }
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

  /**
   * 项目发售
   **/
  onProductSell() {
    this.state.globalLoadingSwitch(true);
    this.net.postSellNft$({
      id: this.productId,
      type: this.sellType === 'fixed' ? 1 : 2,
      price: this.startPrice,
      fixedBuyer: this.fixedBuyer,
      payContract: this.selectedBuyToken[0].token,
      payTokenName: this.selectedBuyToken[0].name,
      start: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().add(this.sellTimeLine[0].num, this.sellTimeLine[0].unit).format('YYYY-MM-DD HH:mm:ss'),
      number: this.sellNumber
    }).pipe(this.pipeSwitch$()).subscribe(result => {
      if (result.code !== 200) {
        this.message.warn(result.msg??$localize`刊登失败`);
        this.state.globalLoadingSwitch(false);
        return;
      }
      const signStr = result.data.sign;
      const orderId = result.data.order.ID;
      // 进行签名
      this.message.info($localize`需要使用您账户对数据签名`);
      ToolFuncWalletSign(signStr).subscribe(signed => {
        this.state.globalLoadingSwitch(false);
        if (signed) {
          this.state.globalLoadingSwitch(true);
          this.net.postSellNftSign$(orderId, signed).subscribe(res => {
            this.state.globalLoadingSwitch(false);
            if (res.code === 200) {
              this.message.success($localize`挂售成功`);
            } else {
              this.message.warn(res.msg??$localize`挂售失败`);
            }
          });
        } else {
          this.state.globalLoadingSwitch(false);
        }
      });
    });;
  }

}
