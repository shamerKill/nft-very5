import { ToolFuncNumberMul } from './../../tools/functions/number';
import { ToolFuncWalletSign } from 'src/app/tools/functions/wallet';
import { ConfirmationService } from 'primeng/api';
import { stripHexPrefix, isAddress, encodePacked } from 'web3-utils';
import { ToolFuncFormatTimeStr, TypeToolFuncDownTime } from './../../tools/functions/time';
import { ManipulateType } from './../../../../node_modules/dayjs/esm/index.d';
import { BaseMessageService } from './../../server/base-message.service';
import { combineLatest, interval, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NetService } from './../../server/net.service';
import { StateService } from './../../server/state.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import cosmo from 'cosmo-wallet-tool';
import { ClipboardService } from 'ngx-clipboard';
import * as RelativeTime from 'dayjs/plugin/relativeTime';
import web3Abi from 'web3-eth-abi';

dayjs.extend(RelativeTime);

type shareItem = {
  label:string;
  icon: string
}

@Component({
  selector: 'app-show-nft',
  templateUrl: './show-nft.component.html',
  styleUrls: ['./show-nft.component.scss']
})
export class ShowNftComponent extends ToolClassAutoClosePipe implements OnInit, OnDestroy {
  marketContract = environment.marketContract;
  // 日期列表
  dayList: {name: string, num: number, unit: ManipulateType}[] = [
    {name: $localize`1 天`, num: 1, unit: 'd'},
    {name: $localize`3 天`, num: 3, unit: 'd'},
    {name: $localize`7 天`, num: 7, unit: 'd'},
    {name: $localize`1 个月`, num: 1, unit: 'M'},
    {name: $localize`3 个月`, num: 3, unit: 'M'},
  ];
  // 倒计时时间对象
  downTimeData?: TypeToolFuncDownTime<string>;
  downTimeSub?: Subscription;

  /**
   * 购买弹窗数据
   **/
  buyOverview = {
    overviewDisplay: false, // 弹窗显示
    sellIndex: 0, // 购买的第几个
    balance: '0', // 对应的账户余额
    dynamic: -1, // 代币精度
    paying: false, // 是否在支付中
  };
  /**
   * 竞拍弹窗数据
   **/
  auctionOverview = {
    overviewDisplay: false, // 弹窗显示
    sellIndex: 0, // 购买的第几个
    balance: '0', // 对应的账户余额
    outPrice: '', // 报价
    endTime: [this.dayList[0]], // 有效期
    dynamic: -1, // 代币精度
    paying: false, // 是否在支付中
    orderHash: '',
  };
  /**
   * 赠送弹窗数据
   **/
  giftOverview = {
    overviewDisplay: false, // 弹窗显示
    toAddress: '', // 受赠者地址
    number: 1, // 赠送数量
    paying: false, // 是否在支付中
  };

  chooseItem:{
    tokenName: string; // 支付代币名
    tokenContract: string; // 支付代币合约
    sellerSigned: string; // 出售者签名
    endTime: string; // 结束时间
    sellType: number; // 出售方式 0指定地址 1固定 2拍卖
    fixedBuyer?: string; // 是否有指定购买
    startPrice: string; // 初始价格
    sellerAddress: string;  // 售卖地址
    maxPrice: string; // 最高价
    id: string; // 订单id
  } = {
    tokenName: '',
    tokenContract: '',
    sellerSigned: '',
    endTime: '',
    sellType: 0,
    fixedBuyer: '',
    startPrice: '',
    sellerAddress: '',
    maxPrice: '',
    id: '',
  }

  /**
   * 收藏品ID
   **/
  productId: string = '';
  /**
   * 用户拥有nft数量
   **/
  userHadNftNum = 0;
  /**
   * 用户是否可以编辑当前nft
   **/
  userCanEdit = false;
  /**
   * 用户信息
   **/
  userInfoAddress = '';
  /**
   * 我是否关注了
   **/
  isFollow = false;
  // nft信息
  productInfo: Partial<{
    image: string;
    name: string;
    id: string;
    type: string; // PRC1155orPRC721
    contractAddress: string; // nft合约地址
    describe: string;
    nowPrice: string; // 最新成交价
    nowPriceUnit: string; // 最新成交价单位
    followerVol: number; // 收藏者数量
    ownerNum: number; // 拥有者数量
    myNum: number; // 已拥有数量
    createdNum: number; // 发行数量
    creator: { // 创建者
      name: string;
      avatar: string;
      address: string;
      describe: string;
    },
    attributes: {key: string, value: string}[]; // 属性列表
    incomeRate: string; // 创建者抽成
    systemRate: string; // 系统抽成
    collection: { // 合集信息
      name: string;
      mainBg: string;
      describe: string;
      id: string;
    };
    infoInChain: { // 上链信息
      contractAddress: string; // 合约地址
      tokenId: string; // 代币id
      sourceData: string; // 原始数据
    }
  }> = {};

  // 卖家列表
  sellerOrderList: {
    tokenName: string; // 支付代币名
    tokenContract: string; // 支付代币合约
    sellerSigned: string; // 出售者签名
    endTime: string; // 结束时间
    sellType: number; // 出售方式 0指定地址 1固定 2拍卖
    fixedBuyer?: string; // 是否有指定购买
    startPrice: string; // 初始价格
    sellerAddress: string;  // 售卖地址
    sellerAvatar: string; // 卖家头像
    sellerName: string; // 卖家名称
    maxPrice: string; // 最高价
    id: string; // 订单id
    sellNum: number; // 出售数量
    orderHash: string; // 订单hash
    showAuctionBtn: boolean; // 是否展示报价成交按钮
  }[] = [];


  // 买家报价
  outputPriceList: {
    priceOfBaseToken: string;
    baseToken: string;
    // 剩余天数
    remainingDays: string;
    // 报价用户
    user: {
      name: string;
      logo: string;
      address: string;
    };
    // 售卖用户
    seller: {
      name: string;
      logo: string;
      address: string;
    };
    sellNum: number; // 出售数量
  }[] = [];

  // 交易历史
  marketHistoryList: {
    type: string, // 类型
    price: string, // 价格
    tokenName: string, // 币种
    user: { // 操作用户
      name: string,
      logo: string,
      address: string,
    },
    toUser: { // 接受用户
      name: string;
      logo: string;
      address: string;
    }
    time: string, // 过去时间
    sellNum: number; // 出售数量
  }[] = [];

  // 更多推荐
  moreRecommend: {
    image: string,
    name: string,
    creator: string,
    id: string,
    price: string,
  }[] = [];

  shareShow:boolean=false;
  shareItems:shareItem[] = [
    {label: $localize`复制链接`, icon: 'pi pi-copy'},
    {label: $localize`Facebook`, icon: 'pi pi-facebook'},
    {label: $localize`Twitter`, icon: 'pi pi-twitter'},
  ]
  constructor(
    private route: ActivatedRoute,
    private state: StateService,
    private net: NetService,
    private message: BaseMessageService,
    private router: Router,
    private clipboard: ClipboardService,
    private confirm: ConfirmationService,
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
        this.getTransferListHistory();
      }
    });
  }

  ngOnInit(): void {
  }

  override ngOnDestroy() {
    this.state.globalLoading$.next(0);
    super.ngOnDestroy();
  }

  // 获取nft信息
  getNftInfo() {
    this.state.globalLoadingSwitch(true);
    this.net.getNftInfoById$(this.productId, this.state.linkedWallet$.value.accountAddress??'').subscribe(result => {
      this.state.globalLoadingSwitch(false);
      // 判断用户是否拥有nft
      if (result.code === 200) {
        const data = result.data;
        this.checkNftOwner(data.nft.HaveNfts);
        this.checkNftEdit(data.nft);
        this.formatNftInfo(data);
        this.getNftSellInfo(this.productId);
        this.getBuyerPriceOrder(this.productId);
        this.getNowCollectionInfo(data.nft.CollectionID);
      } else {
        this.message.warn($localize`获取数据失败`);
      }
    });
  }

  // 获取nft出售信息
  getNftSellInfo(id: string) {
    this.state.globalLoadingSwitch(true);
    this.net.getNftSellingOrders$(id).subscribe(result => {
      this.state.globalLoadingSwitch(false);
      if (result.code == 200) {
        const data = result.data;
        this.sellerOrderList = [];
        if (Array.isArray(data) && data.length) {
          this.sellerOrderList = data.map((item: any) => {
            // 判断订单是否到期
            const outTime = dayjs(item.ExpirationTime).diff(dayjs()) <= 0;
            // 判断是否有报价
            let outPrice = 0;
            if (item.Offers && item.Offers.length) {
              if (parseFloat(item.Offers[0].Amount) >= parseFloat(item.StartPrice)) outPrice = parseFloat(item.Offers[0].Amount);
            }
            return {
              tokenName: item.CoinType,
              tokenContract: item.Token,
              sellerSigned: item.ClientSignature,
              endTime: item.ExpirationTime,
              sellType: item.AssignAddress === this.userInfoAddress ? 0 : item.OrderType - 0,
              fixedBuyer: item.AssignAddress??undefined,
              startPrice: item.StartPrice,
              sellerAddress: item.MakerAddr,
              sellerAvatar: item.Maker.Avator||'../../assets/images/logo/default-avatar@2x.png',
              sellerName: item.Maker.Name,
              maxPrice: item.CurrentPrice,
              id: item.ID,
              sellNum: item.Number,
              orderHash: item.OrderHash,
              showAuctionBtn: (item.Maker.Address === this.userInfoAddress && outTime && outPrice > 0),
            };
          });
          this.changeEndTime(this.sellerOrderList[0].endTime);
        }
      } else {
        this.message.warn(result.msg ?? $localize`获取数据失败`);
      }
    });
  }

  // 判断用户是否拥有nft
  checkNftOwner(data: any) {
    if (data && Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].Owner === this.userInfoAddress) {
          this.userHadNftNum = data[i].Value;
          this.productInfo.myNum = data[i].Value;
          break;
        } else {
          this.userHadNftNum = 0;
        }
      }
    }
  }
  // 判断用户是否可以编辑
  checkNftEdit(data: any) {
    if (data.Creator === this.userInfoAddress && data.IsPlagFrom === true && data.SellFre === 0) {
      this.userCanEdit = true;
    } else {
      this.userCanEdit = false;
    }
  }
  // 对nft进行赋值
  formatNftInfo(data: any) {
    this.productInfo.image = data.nft.NftOriginal.Image;
    this.productInfo.name = data.nft.NftOriginal.Name;
    this.productInfo.id = data.nft.NftOriginal.NftID;
    this.productInfo.describe = data.nft.NftOriginal.Description;
    this.productInfo.createdNum = data.nft.CreatorNumber;
    this.productInfo.followerVol = data.collectPeople;
    this.productInfo.type = data.nft.Type;
    this.productInfo.contractAddress = data.nft.Token;
    this.productInfo.nowPrice = data.nft.CurrentPrice;
    this.productInfo.attributes = data.nft.NftOriginal.Attributes.split(',').map((item: string) => {
      var li = item.split(':');
      return {key: li[0], value: li[1]};
    }).filter((item: any) => item.key && item.value);
    this.productInfo.creator = {
      name: data.creator.Name,
      avatar: data.creator.Avator||'../../assets/images/logo/default-avatar@2x.png',
      address: data.nft.Creator,
      describe: data.creator.Description,
    };
    this.isFollow = data.isCollect;
    this.productInfo.ownerNum = data.havePeople;
    this.getCollectionInfo(data.nft.CollectionID);
    this.getProductOfChainInfo(data.nft);
  }

  /**
   * 合集数据
   **/
  getCollectionInfo(id: string) {
    this.state.globalLoadingSwitch(true);
    this.net.getCollectionDetail$(id).pipe(this.pipeSwitch$()).subscribe(result => {
      this.state.globalLoadingSwitch(false);
      if (result.code === 200) {
        this.productInfo.incomeRate = (result.data.CollectionOriginal.SellerFeeBasisPoints / 100).toString();
        this.productInfo.collection = {
          name: result.data.CollectionOriginal.Name,
          id: result.data.CollectionOriginal.CollectionID,
          describe: result.data.CollectionOriginal.Description,
          mainBg: result.data.ImageUrl,
        };
      }
    });
  }

  /**
   * 获取链上数据
   **/
  getProductOfChainInfo(nft: any) {
    this.productInfo.infoInChain = {
      contractAddress: nft.Token,
      tokenId: nft.TokenID,
      sourceData: nft.TokenURI,
    };
  }

  /**
   * 刷新数据
   **/
  onReload() {
    this.getNftInfo();
  }
  /**
   * 出售nft
   **/
  onSellNft() {
    this.router.navigate(['sell/nft', this.productId]);
  }
  /**
   * 编辑nft
   **/
  onEditNft() {
    this.router.navigate(['edit/nft', this.productId]);
  }
  /**
   * 关注nft
   **/
  onFollowProduct() {
    if (this.isFollow) {
      this.net.putDelStar$('nft', this.productId).subscribe(data => {
        if (data.code !== 200) {
          this.isFollow = true;
          return this.message.warn(data.msg??$localize`取消关注失败`);
        } else {
          this.isFollow = false;
          if (this.productInfo.followerVol) {
            this.productInfo.followerVol -= 1;
          }
          return this.message.success(data.msg??$localize`取消关注成功`);
        }
      });
    } else {
      this.net.putAddStar$('nft', this.productId).subscribe(data => {
        if (data.code !== 200) {
          this.isFollow = false;
          return this.message.warn(data.msg??$localize`关注失败`);
        } else {
          this.isFollow = true;
          if (this.productInfo.followerVol !== undefined) {
            this.productInfo.followerVol += 1;
          }
          return this.message.success(data.msg??$localize`关注成功`);
        }
      });
    }
    this.isFollow = !this.isFollow;
  }

  /**
   * 展示弹窗
   **/
  showDialog(index?: number) {
    if (index === undefined) {
      // 赠送
      this.giftOverview.overviewDisplay = true;
    } else {
      const item = this.sellerOrderList[index];
      // 展示不同弹窗
      if (item.sellType === 2) {
        this.auctionOverview.overviewDisplay = true;
        this.auctionOverview.outPrice = item.maxPrice;
      } else {
        this.buyOverview.overviewDisplay = true;
      }
      this.chooseItem = item;
      // 获取对应币种余额
      this.state.globalLoadingSwitch(true);
      this.net.getAccountCoinBalance$(item.tokenContract).pipe(this.pipeSwitch$()).subscribe(data => {
        this.state.globalLoadingSwitch(false);
        if (data.code === 200) {
          if (item.sellType === 2) {
            this.auctionOverview.balance = data.data.balance;
            this.auctionOverview.dynamic = data.data.detail.Decimals;
            this.auctionOverview.orderHash = item.orderHash;
          } else {
            this.buyOverview.balance = data.data.balance;
            this.buyOverview.dynamic = data.data.detail.Decimals;
          }
        }
      });
    }
  }
  // 修改竞拍持续时间
  changeSellTimeLine(event: any) {
    this.auctionOverview.endTime = [event.itemValue];
  }

  // 修改倒计时
  changeEndTime(endTime: string) {
    this.downTimeSub?.unsubscribe();
    const hadTime = dayjs(endTime).diff(dayjs());
    this.downTimeData = ToolFuncFormatTimeStr(hadTime);
    this.downTimeSub = interval(1000).pipe(this.pipeSwitch$()).subscribe(() => {
      const hadTime = dayjs(endTime).diff(dayjs());
      if (hadTime <= 0) {
        this.downTimeData = undefined;
        this.downTimeSub?.unsubscribe();
      } else {
        this.downTimeData = ToolFuncFormatTimeStr(hadTime);
      }
    });
  }

  /**
   * 购买
   **/
  async onBuy() {
    this.state.globalLoadingSwitch(true);
    this.buyOverview.overviewDisplay = false;
    // pc 不需要查询授权直接执行购买；其他代币需要执行授权查询
    const willPrice = BigInt(ToolFuncNumberMul(this.chooseItem.maxPrice, Math.pow(10,this.buyOverview.dynamic).toString()));
    if (this.chooseItem.tokenName == 'PC') {
      this.submitBuy(willPrice);
    } else {
      if (this.buyOverview.dynamic < 0) {
        this.message.warn($localize`获取数据失败`);
        return;
      }
      if (await this.queryAuth(willPrice))  {
        this.submitBuy();
      }
    }
  }
  // 查询授权之后执行授权或购买
  async queryAuth(willPrice: BigInt): Promise<boolean> {
    if (this.state.linkedWallet$.value.isLinked) {
      this.state.globalLoadingSwitch(true);
      let userAddress = cosmo.addressForBech32ToHex(this.state.linkedWallet$.value.accountAddress??'')
      let hexContractAddress = cosmo.addressForBech32ToHex(this.chooseItem.tokenContract)
      let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.marketContract)
      const rawAllow = web3Abi.encodeFunctionSignature('allowance(address,address)') +
                  stripHexPrefix(
                    web3Abi.encodeParameters(
                      ['address', 'address'],
                      [userAddress, hexMarkenContractAddress]
                    )
                  );
      let result: string = '0';
      if (await cosmo.isChrome) {
        result = (await cosmo.chromeTool.contractCallRaw(hexContractAddress, rawAllow, 0)) ?? '';
      } else {
		    result = (await cosmo.walletTool.contractCall(hexContractAddress, undefined, undefined, rawAllow))?.data ?? '';
      }
      if (result !== '0x') result = BigInt(result).toString();
      // 判断是否足够
      console.log(result)
      if (willPrice <= BigInt(result)) {
        this.state.globalLoadingSwitch(false);
        return true;
      }
      // 进行授权
      const rawApprove = web3Abi.encodeFunctionSignature('approve(address,uint256)') +
                  stripHexPrefix(
                    web3Abi.encodeParameters(
                      ['address', 'uint256'],
                      [hexMarkenContractAddress, willPrice.toString()]
                    )
                  );
      if (await cosmo.isChrome) {
        const res = await cosmo.chromeTool.contractSendRaw(hexContractAddress, rawApprove);
        if (res) {
          this.state.globalLoadingSwitch(false);
          return true;
        }
      } else {
        const res = await cosmo.walletTool.contractSend(hexContractAddress, undefined, undefined, rawApprove);
        if (res?.data) {
          this.state.globalLoadingSwitch(false);
          return true;
        }
      }
      this.state.globalLoadingSwitch(false);
      return false;
    }
    return false;
  }
  submitBuy(willPrice?: BigInt) {
    this.net.getNftBuyOrderInfo$(this.chooseItem.id).subscribe(async data => {
      if (data.code !== 200) {
        this.state.globalLoadingSwitch(false);
        return this.message.warn(data.msg??$localize`获取信息失败`);
      } else {
        let info = '0x' + data.data;
        let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.marketContract)
        if (await cosmo.isChrome) {
          const res = await cosmo.chromeTool.contractSendRaw(hexMarkenContractAddress,info, willPrice ? willPrice.toString() as any : undefined);
          if (res) {
            this.message.success($localize`等待区块确认`);
          }
        } else {
          const res = await cosmo.walletTool.contractSend(hexMarkenContractAddress, undefined, undefined, info, willPrice ? willPrice.toString() : undefined);
          if (res?.data) {
            this.message.success($localize`等待区块确认`);
          }
        }
        this.state.globalLoadingSwitch(false);
        this.onReload();
      }
    })
  }
  /**
   * 竞拍
   **/
  async onAuction() {
    this.state.globalLoadingSwitch(true);
    const willPrice = BigInt(this.auctionOverview.outPrice) * BigInt(Math.pow(10,this.auctionOverview.dynamic));
    if (await this.queryAuth(willPrice)) {
      // 进行签名
      let signData = '';
      const raw = web3Abi.encodeFunctionSignature('getVerifyAdvancedSignature(bytes32,uint256)') +
                  stripHexPrefix(
                    web3Abi.encodeParameters(
                      ['bytes32', 'uint256'],
                      [this.auctionOverview.orderHash, willPrice.toString()]
                    )
                  );
      let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.marketContract);
      if (await cosmo.isChrome) {
        signData = await cosmo.chromeTool.contractCallRaw(hexMarkenContractAddress, raw, 0) || '';
      } else {
        signData = (await cosmo.walletTool.contractCall(hexMarkenContractAddress, undefined, undefined, raw))?.data || '';
      }
      signData = web3Abi.decodeParameter('bytes', signData) as any;
      this.message.info($localize`需要使用您账户对数据签名`);
      ToolFuncWalletSign(signData).subscribe(signed => {
        this.state.globalLoadingSwitch(false);
        if (signed) {
          this.state.globalLoadingSwitch(true);
          this.net.getNftOfferOrderInfo$(this.chooseItem.id,this.auctionOverview.outPrice,signed).subscribe(data => {
            this.state.globalLoadingSwitch(false);
            if (data.code !== 200) {
              return this.message.warn(data.msg??$localize`竞价失败`);
            } else {
              this.auctionOverview.overviewDisplay = false;
              this.message.success($localize`竞价成功`);
              this.onReload();
            }
          });
        }
      });
    }
  }

  /**
   * 赠送
   **/
  async onGift() {
    this.state.globalLoadingSwitch(true);
    // 合约地
    let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.productInfo.contractAddress??'') // 合约地址需要核实
    // 用户地址
    let userAddress = cosmo.addressForBech32ToHex(this.state.linkedWallet$.value.accountAddress??'')
    // 传入地址
    let toAddress = isAddress(this.giftOverview.toAddress) ? this.giftOverview.toAddress : cosmo.addressForBech32ToHex(this.giftOverview.toAddress);
    let raw = '';
    if (this.productInfo.type == 'PRC1155') {
      raw = web3Abi.encodeFunctionSignature('safeTransferFrom(address,address,uint256,uint256,bytes)') +
        stripHexPrefix(
            web3Abi.encodeParameters(
              ['address', 'address', 'uint256', 'uint256', 'bytes'],
              [
                userAddress,
                toAddress,
                this.productInfo.infoInChain?.tokenId,
                this.giftOverview.number,
                '0x'
              ]
            )
          );
    } else {
      raw = web3Abi.encodeFunctionSignature('safeTransferFrom(address,address,uint256,bytes)') +
        stripHexPrefix(
          web3Abi.encodeParameters(
            ['address', 'address', 'uint256', 'bytes'],
            [
              userAddress,
              toAddress,
              this.productInfo.infoInChain?.tokenId,
              '0x'
            ]
          )
        );
    }
    if (raw) {
      if (await cosmo.isChrome) {
        const res = await cosmo.chromeTool.contractSendRaw(hexMarkenContractAddress, raw);
        if (res) {
          this.message.success($localize`等待区块确认`);
        }
      } else {
        const res = await cosmo.walletTool.contractSend(hexMarkenContractAddress, undefined, undefined, raw);
        if (res?.data) {
          this.message.success($localize`等待区块确认`);
        }
      }
    }
    this.state.globalLoadingSwitch(false);
    this.giftOverview.overviewDisplay = false;
    this.onReload();
    return;
  }
  showShare() {
    this.shareShow = !this.shareShow;
  }
  chooseShare(i:number) {
    let nowUrl:string = window.location.href;
    if (i == 0) {
      this.clipboard.copy(nowUrl);
    } else if (i==1) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${nowUrl}`)
    } else if (i==2) {
      window.open(`https://twitter.com/intent/tweet?text=Check out this item on Very5&url=${nowUrl}&via=Plugchainclub`)
    }
    this.shareShow = false;
  }
  copyText(text?:string) {
    this.clipboard.copy(text??'');
  }
  // 处理买家报价
  getBuyerPriceOrder(id: string) {
    this.net.getBuyerPriceOrder$(id).pipe(this.pipeSwitch$()).subscribe(result => {
      this.outputPriceList = [];
      if (result.code === 200 && result.data && result.data.length) {
        this.outputPriceList = result.data.map((item: any) => {
          return {
            priceOfBaseToken: item.Amount,
            baseToken: item.Order.CoinType,
            remainingDays: dayjs(item.CreatedAt).fromNow(),
            user: {
              address: item.OfferAccount.Address,
              name: item.OfferAccount.Name,
              logo: item.OfferAccount.Avator||'../../assets/images/logo/default-avatar@2x.png',
            },
            seller: {
              address: item.Order.Maker.Address,
              name: item.Order.Maker.Name,
              logo: item.Order.Maker.Avator||'../../assets/images/logo/default-avatar@2x.png',
            },
            sellNum: item.Order.Number,
          };
        });
      }
    });
  }

  // 获取交易历史
  getTransferListHistory() {
    this.net.getTransferListHistory$({
      nftID: this.productId
    }).pipe(this.pipeSwitch$()).subscribe(result => {
      if (result.code !== 200) return;
      this.marketHistoryList = [];
      if (result.data && result.data.length) {
        const typeShow: {[key in any]: string} = {
          'create': $localize`挂售`,
          'successful': $localize`交易成功`,
          'cancelled': $localize`撤回`,
          'make': $localize`创建`,
        };
        console.log(result.data);
        this.marketHistoryList = result.data.map((item: any) => {
          return {
            type: typeShow[item.EventType],
            price: item.TotalPrice,
            tokenName: item.PaymentToken,
            user: {
              name: item.FromAccount.Name,
              logo: item.FromAccount.Avator||'../../assets/images/logo/default-avatar@2x.png',
              address: item.FromAccount.Address,
            },
            toUser: {
              name: item.ToAccount.Name,
              logo: item.ToAccount.Avator||'../../assets/images/logo/default-avatar@2x.png',
              address: item.ToAccount.Address,
            },
            time: dayjs(item.CreatedAt).fromNow(),
          };
        }).slice(0, 10);
      }
    });
  }

  // 获取当前合集列表
  getNowCollectionInfo(collectionId: string) {
    this.net.getNftListByCollectionId$(collectionId).pipe(this.pipeSwitch$()).subscribe(result => {
      if (result.code === 200 && result.data && result.data.length) {
        this.moreRecommend = result.data
          .filter((item: any) => item.NftOriginal.NftID != this.productId)
          .map((item: any) => {
            return {
              image: item.NftOriginal.Image,
              name: item.NftOriginal.Name,
              creator: item.Creator,
              id: item.NftOriginal.NftID,
              price: item.BeforePrice,
            };
          });
      }
    });
  }

  /**
   * 撤回售卖
   **/
  onCancelOrder(index: number) {
    const item = this.sellerOrderList[index];
    this.confirm.confirm({
      header: $localize`撤回提示`,
      message: $localize`是否撤回当前挂卖？`,
      acceptLabel: $localize`确定`,
      rejectLabel: $localize`取消`,
      accept: () => {
        this.net.delSellOrder$(item.id).pipe(this.pipeSwitch$()).subscribe(res => {
          if (res.code === 200) {
            this.message.success($localize`撤回成功`);
            this.onReload();
          } else {
            this.message.warn(res.msg||$localize`撤回失败`);
          }
        });
      },
    });
  }

  /**
   * 定价成交
   **/
  onAuctionSuccess(index: number) {
    const sellItem = this.sellerOrderList[index];
    this.confirm.confirm({
      header: $localize`成交提示`,
      message: $localize`是否接受当前报价？`,
      acceptLabel: $localize`确定`,
      rejectLabel: $localize`取消`,
      accept: () => {
        this.net.getBuyerPrice$(sellItem.id).pipe(this.pipeSwitch$()).subscribe(async res => {
          if (res.code === 200 && res.data) {
            let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.marketContract);
            const raw = '0x' + res.data;
            let signData = '';
            if (await cosmo.isChrome) {
              signData = await cosmo.chromeTool.contractSendRaw(hexMarkenContractAddress, raw) || '';
            } else {
              signData = (await cosmo.walletTool.contractSend(hexMarkenContractAddress, undefined, undefined, raw))?.data || '';
            }
            console.log(signData);
          } else {
            this.message.warn(res.msg||$localize`接受报价失败`);
          }
        });
      },
    });
  }
}
