import { ToolFuncFormatTimeStr, TypeToolFuncDownTime } from './../../tools/functions/time';
import { ManipulateType } from './../../../../node_modules/dayjs/esm/index.d';
import { BaseMessageService } from './../../server/base-message.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { combineLatest, interval } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NetService } from './../../server/net.service';
import { StateService } from './../../server/state.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import cosmo from 'cosmo-wallet-tool';
const Web3 = require('web3');
export const web3 = new Web3(new Web3.providers.HttpProvider("https://testapi.plugchain.network/ethraw/"));

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

  /**
   * 购买弹窗数据
   **/
  buyOverview = {
    overviewDisplay: false, // 弹窗显示
    sellIndex: 0, // 购买的第几个
    balance: '0', // 对应的账户余额
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
    paying: false, // 是否在支付中
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
    id: ''
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
    maxPrice: string; // 最高价
    id: string; // 订单id
  }[] = [];


  // TODO: 未获取
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

  // TODO: 未获取
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

  // TODO: 未获取
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
    private clipboard: Clipboard
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
        console.log(data);
        this.checkNftOwner(data.nft.HaveNfts);
        this.checkNftEdit(data.nft);
        this.formatNftInfo(data);
        this.getNftSellInfo(this.productId);
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
        if (Array.isArray(data) && data.length) {
          this.sellerOrderList = data.map((item: any) => {
            return {
              tokenName: item.CoinType,
              tokenContract: item.Token,
              sellerSigned: item.ClientSignature,
              endTime: item.ExpirationTime,
              sellType: item.AssignAddress === this.userInfoAddress ? 0 : item.OrderType - 0,
              fixedBuyer: item.AssignAddress??undefined,
              startPrice: item.StartPrice,
              sellerAddress: item.MakerAddr,
              // TODO: 最高价未获取
              maxPrice: item.StartPrice,
              id: item.ID
            };
          });
          this.changeEndTime(this.sellerOrderList[0].endTime);
        }
        console.log(result.data);
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
        }
      }
    }
  }
  // 判断用户是否可以编辑
  checkNftEdit(data: any) {
    if (data.Creator === this.userInfoAddress && data.IsPlagFrom === true && data.SellFre === 0) {
      this.userCanEdit = true;
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
    this.productInfo.attributes = data.nft.NftOriginal.Attributes.split(',').map((item: string) => {
      var li = item.split(':');
      return {key: li[0], value: li[1]};
    });
    this.productInfo.creator = {
      name: data.creator.Name,
      avatar: data.creator.Avator,
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
          return this.message.success(data.msg??$localize`取消关注成功`);
        }
      });
    } else {
      this.net.putAddStar$('nft', this.productId).subscribe(data => {
        if (data.code !== 200) {
          this.isFollow = false;
          return this.message.warn(data.msg??$localize`关注失败`);
        } else {
          this.isFollow = false;
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
    }
  }
  // 修改竞拍持续时间
  changeSellTimeLine(event: any) {
    this.auctionOverview.endTime = [event.itemValue];
  }

  // 修改倒计时
  changeEndTime(endTime: string) {
    const hadTime = dayjs(endTime).diff(dayjs());
    this.downTimeData = ToolFuncFormatTimeStr(hadTime);
    const timer = interval(1000).pipe(this.pipeSwitch$()).subscribe(() => {
      const hadTime = dayjs(endTime).diff(dayjs());
      if (hadTime <= 0) {
        this.downTimeData = undefined;
        timer.unsubscribe();
      } else {
        this.downTimeData = ToolFuncFormatTimeStr(hadTime);
      }
    });
  }

  /**
   * TODO: 未实现
   * 购买
   **/
  onBuy() {
    this.state.globalLoadingSwitch(true);
    this.buyOverview.overviewDisplay = false;
    // 数据在this.buyOverview
    // pc 不需要查询授权直接执行购买；其他代币需要执行授权查询
    console.log(this.chooseItem)
    if (this.chooseItem.tokenName == 'PC') {
      this.submitBuy();
    } else {
      this.queryAuth();
    }
  }
  // 查询授权之后执行授权或购买
  queryAuth() {
    if (this.state.linkedWallet$.value.isLinked) {
      let userAddress = cosmo.addressForBech32ToHex(this.state.linkedWallet$.value.accountAddress??'')
      let hexContractAddress = cosmo.addressForBech32ToHex(this.chooseItem.tokenContract)
      let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.marketContract)
      cosmo.isChrome.then(res => {
        if (res) {
          cosmo.chromeTool.contractCall(
            hexContractAddress,
            'allowance(address,address)',
            [userAddress,hexMarkenContractAddress],
          ).then((res:any) => {
            if (res < parseFloat(this.chooseItem.maxPrice)*Math.pow(10,6)) {
              cosmo.chromeTool.contractSend(
                hexContractAddress,
                'approve(address,uint256)',
                [hexMarkenContractAddress,parseFloat(this.chooseItem.maxPrice)*Math.pow(10,6)]
              ).then(res => {
                this.submitBuy();
              }).catch(() => {
                this.state.globalLoadingSwitch(false);
              })
            } else {
              this.submitBuy();
            }
          }).catch(() => {
            this.state.globalLoadingSwitch(false);
          })
        } else {
          cosmo.walletTool.contractCall(
            hexContractAddress,
            'allowance(address,address)',
            [userAddress,hexMarkenContractAddress],
          ).then((res:any) => {
            let result = res.data
            if (result !== '0x') result = web3.eth.abi.decodeParameter('uint256[]', result)[0];
	          else result = '0';
            if (result < parseFloat(this.chooseItem.maxPrice)*Math.pow(10,6)) {
              cosmo.chromeTool.contractSend(
                hexContractAddress,
                'approve(address,uint256)',
                [hexMarkenContractAddress,parseFloat(this.chooseItem.maxPrice)*Math.pow(10,6)]
              ).then(res => {
                this.submitBuy();
              }).catch(() => {
                this.state.globalLoadingSwitch(false);
              })
            } else {
              this.submitBuy();
            }
          }).catch(() => {
            this.state.globalLoadingSwitch(false);
          })
        }
      })
    }
  }
  submitBuy() {
    this.net.getNftBuyOrderInfo$(this.chooseItem.id).subscribe(data => {
      if (data.code !== 200) {
        return this.message.warn(data.msg??$localize`获取信息失败`);
      } else {
        let info = data.data;
        console.log(info)
        let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.marketContract)
        cosmo.isChrome.then(res => {
          if (res) {
            cosmo.chromeTool.contractSendRaw(hexMarkenContractAddress,info).then(res => {
              this.state.globalLoadingSwitch(false);
              if (res) {
                this.message.success($localize`等待区块确认`);
              }
            }).catch(() => {
              this.state.globalLoadingSwitch(false);
            })
          } else {
            cosmo.walletTool.contractSend(hexMarkenContractAddress,info).then(res => {
              this.state.globalLoadingSwitch(false);
              if (res) {
                this.message.success($localize`等待区块确认`);
              }
            }).catch(() => {
              this.state.globalLoadingSwitch(false);
            })
          }
        }).catch(() => {
          this.state.globalLoadingSwitch(false);
        })
      }
    })
  }
  /**
   * TODO: 未实现
   * 竞拍
   **/
  onAuction() {
    // 数据在this.auctionOverview
    this.state.globalLoadingSwitch(true);
    this.net.getNftOfferOrderInfo$(this.chooseItem.id,this.auctionOverview.outPrice).subscribe(data => {
      this.state.globalLoadingSwitch(false);
      if (data.code !== 200) {
        return this.message.warn(data.msg??$localize`竞价失败`);
      } else {
        this.message.success($localize`竞价成功`);
      }
    })
  }

  /**
   * TODO: 未实现
   * 赠送
   **/
  onGift() {
    // 数据在this.giftOverview
    this.state.globalLoadingSwitch(true);
    let hexMarkenContractAddress = cosmo.addressForBech32ToHex(this.productInfo.contractAddress??'') // 合约地址需要核实
    let userAddress = cosmo.addressForBech32ToHex(this.state.linkedWallet$.value.accountAddress??'')
    if (this.productInfo.type == 'PRC1155') {
      cosmo.isChrome.then(res => {
        if (res) {
          cosmo.chromeTool.contractSend(hexMarkenContractAddress,'safeTransferFrom(address,address,uint256,uint256,bytes)',[userAddress,this.giftOverview.toAddress,this.productInfo.id,this.giftOverview.number,'']).then(res => {
            this.state.globalLoadingSwitch(false);
            if (res) {
              this.message.success($localize`等待区块确认`);
            }
          }).catch(() => {
            this.state.globalLoadingSwitch(false);
          })
        } else {
          cosmo.walletTool.contractSend(hexMarkenContractAddress,'safeTransferFrom(address,address,uint256,uint256,bytes)',[userAddress,this.giftOverview.toAddress,this.productInfo.id,this.giftOverview.number,'']).then(res => {
            this.state.globalLoadingSwitch(false);
            if (res) {
              this.message.success($localize`等待区块确认`);
            }
          }).catch(() => {
            this.state.globalLoadingSwitch(false);
          })
        }
      }).catch(() => {
        this.state.globalLoadingSwitch(false);
      })
    } else {
      cosmo.isChrome.then(res => {
        if (res) {
          cosmo.chromeTool.contractSend(hexMarkenContractAddress,'safeTransferFrom(address,address,uint256,bytes)',[userAddress,this.giftOverview.toAddress,this.productInfo.id,'']).then(res => {
            this.state.globalLoadingSwitch(false);
            if (res) {
              this.message.success($localize`等待区块确认`);
            }
          }).catch(() => {
            this.state.globalLoadingSwitch(false);
          })
        } else {
          cosmo.walletTool.contractSend(hexMarkenContractAddress,'safeTransferFrom(address,address,uint256,bytes)',[userAddress,this.giftOverview.toAddress,this.productInfo.id,'']).then(res => {
            this.state.globalLoadingSwitch(false);
            if (res) {
              this.message.success($localize`等待区块确认`);
            }
          }).catch(() => {
            this.state.globalLoadingSwitch(false);
          })
        }
      }).catch(() => {
        this.state.globalLoadingSwitch(false);
      })
    }
  }
  showShare() {
    this.shareShow = !this.shareShow;
  }
  chooseShare(i:number) {
    let nowUrl:string = window.location.href;
    if (i == 0) {
      this.clipboard.copy(nowUrl);
      this.message.success($localize`复制成功`)
    } else if (i==1) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${nowUrl}`)
    } else if (i==2) {
      window.open(`https://twitter.com/intent/tweet?text=Check out this item on Very5&url=${nowUrl}&via=Plugchainclub`)
    }
    this.shareShow = false;
  }
}
