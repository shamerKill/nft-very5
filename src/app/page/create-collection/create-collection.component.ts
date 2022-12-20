import { ToolFuncTimeSleep } from 'src/app/tools/functions/time';
import { ConfirmationService } from 'primeng/api';
import { StateService } from './../../server/state.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { NetService, TypeInterfaceNet } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { TypeFileEvent } from './../../components/choose-file/choose-file.component';
import { nftTypesArr } from './../../server/database.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { zip } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent extends ToolClassAutoClosePipe implements OnInit, AfterViewInit {

  /**
   * 合集 id 不为null表示为编辑
   **/
  collectionId: null|string = null;

  // 付款代币列表
  buyTokens: {
    name: string;
    minLen: number;
    logo: string;
    token: string;
  }[] = [];
  // 类别
  types = nftTypesArr;
  /**
   * 合集主图
   **/
  mainImage?: string;
  /**
   * 横幅背景
   **/
  bannerBg?: string;
  /**
   * 合集名字
   **/
  name = '';
  /**
   * 合集描述
   **/
  describe = '';
  /**
   * 个性化网址
   **/
  webSite = '';
  /**
   * 创作者收益
   **/
  profit = {
    address: '',
    rate: '',
  };
  /**
   * 社交链接
   **/
  interactiveLink = '';
  /**
   * 类别
   **/
  typeSelected: typeof nftTypesArr = [];
  /**
   * 是否可以创建
   **/
  canCreate = false;
  // 选择的代币
  selectedBuyToken: any[] = [];

  // 创建完是否需要返回上一级
  createdBack?: string;

  // 获取代币列表页数
  tokenListPage = 1;
  tokenListLoading = false;

  constructor(
    private message: BaseMessageService,
    private net: NetService,
    private state: StateService,
    private location: Location,
    private route: ActivatedRoute,
    private confirm: ConfirmationService,
  ) {
    super();
    this.route.params.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data['id']) {
        this.collectionId = data['id'];
        this.getEditCollectionInfo();
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      if (param['back'] === 'nft') {
        this.createdBack = 'nft';
      }
    });
    this.state.linkedWallet$.subscribe(data => {
      this.profit.address = data.accountAddress??'';
    });
    this.getTokenList();
  }
  ngAfterViewInit(): void {
    document.body.scrollTop = 0;
  }
  // 如果是编辑合集的话，获取合集信息
  getEditCollectionInfo() {
    this.state.globalLoadingSwitch(true);
    this.state.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(wallet => {
      this.state.globalLoadingSwitch(false);
      if (!wallet.isLinking && wallet.accountAddress) {
        this.state.globalLoadingSwitch(true);
        this.net.getCollectionDetail$(this.collectionId??'').pipe(this.pipeSwitch$()).subscribe(result => {
          this.state.globalLoadingSwitch(false);
          if (result.code !== 200) {
            this.message.warn($localize`获取数据失败`);
            return this.location.back();
          } else {
            this.bannerBg = result.data.BannerImageUrl;
            this.mainImage = result.data.ImageUrl;
            this.name = result.data.CollectionOriginal.Name;
            this.describe = result.data.CollectionOriginal.Description;
            this.interactiveLink = result.data.CollectionOriginal.ExternalLink;
            this.profit = {
              address: result.data.CollectionOriginal.FeeRecipient,
              rate: (result.data.CollectionOriginal.SellerFeeBasisPoints / 100).toString(),
            };
            this.typeSelected = nftTypesArr.filter(item => item.key === result.data.Category)
            if (result.data.AllowToken) {
              try {
                this.selectedBuyToken = JSON.parse(result.data.AllowToken);
              } catch (_) {}
            }
          }
        });
      }
    });
  }

  /**
   * 获取代币列表
   **/
  getTokenList(event?: any) {
    if (this.tokenListLoading) return;
    if (event !== undefined) {
      if (event.last !== this.buyTokens.length) return;
      else this.tokenListPage += 1;
    }
    this.tokenListLoading = true;
    this.net.getPayTokenList$(this.tokenListPage).pipe(this.pipeSwitch$()).subscribe(data => {
      this.tokenListLoading = false;
      if (data.code === 200 && data.data && data.data.length) {
        if (data.data.length !== 10) this.tokenListLoading = true;
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          this.buyTokens.push({
            name: item.Name,
            minLen: item.Decimals,
            logo: item.Logo,
            token: item.Token,
          });
        }
      }
    });
  }


  /**
   * 获取主图base
   **/
   onGetMainImage(file: TypeFileEvent) {
    if (file.error === 'size') {
      this.message.warn($localize`请检查图片尺寸`);
    } else if (file.error === 'type') {
      this.message.warn($localize`请检查文件类型`);
    }
    if (file.data) {
      this.mainImage = file.data;
      this.onListenData();
    }
  }

  /**
   * 获取封面图base
   **/
  onGetBannerBg(file: TypeFileEvent) {
    if (file.error === 'size') {
      this.message.warn($localize`请检查图片尺寸`);
    } else if (file.error === 'type') {
      this.message.warn($localize`请检查文件类型`);
    }
    if (file.data) {
      this.bannerBg = file.data;
      this.onListenData();
    }
  }

  /**
   * 监听必要数据填写完成
   **/
  onListenData() {
    // 判定数据是否不为空
    if (
      this.mainImage && this.bannerBg &&
      this.name && this.profit.address &&
      this.profit.rate && this.typeSelected.length &&
      this.selectedBuyToken.length
    ) {
      this.canCreate = true;
    } else {
      this.canCreate = false
    }
  }

  /**
   * 创建合集
   **/
  onCreateCollection() {
    // TODO: 需要判断数据是否可以执行
    this.state.globalLoadingSwitch(true);
    // 上传图片
    this.uploadPic().subscribe(images => {
      if (!images) {
        this.state.globalLoadingSwitch(false);
        this.message.warn($localize`图片上传失败`);
        return;
      }
      if (this.collectionId) {
        this.net.postEditCollection$({
          id: this.collectionId,
          name: this.name,
          image: images?.mainImage??'',
          banner_image: images?.bannerBg??'',
          external_link: this.interactiveLink,
          creator_rate: (parseFloat(this.profit.rate) * 100).toFixed(0),
          fee_recipient: this.profit.address,
          category: this.typeSelected[0].key,
          description: this.describe,
          allow_token: JSON.stringify(this.selectedBuyToken)
        }).pipe(this.pipeSwitch$()).subscribe(data => {
          this.state.globalLoadingSwitch(false);
          if (data.code !== 200) return this.message.warn(data.msg ?? $localize`修改失败`);
          this.message.success($localize`修改合集成功`);
          this.canCreate = false;
          this.location.back();
        });
      } else {
        this.net.putNewCollection$({
          name: this.name,
          image: images?.mainImage??'',
          banner_image: images?.bannerBg??'',
          external_link: this.interactiveLink,
          creator_rate: (parseFloat(this.profit.rate) * 100).toFixed(0),
          fee_recipient: this.profit.address,
          category: this.typeSelected[0].key,
          description: this.describe,
          allow_token: JSON.stringify(this.selectedBuyToken)
        }).pipe(this.pipeSwitch$()).subscribe(data => {
          this.state.globalLoadingSwitch(false);
          if (data.code !== 200) return this.message.warn(data.msg ?? $localize`创建失败`);
          this.message.success($localize`创建合集成功`);
          this.bannerBg = '';
          this.mainImage = '';
          this.name = '';
          this.canCreate = false;
          if (this.createdBack === 'nft') {
            this.confirm.confirm({
              header: $localize`创建提示`,
              message: $localize`是否返回继续创建收藏品？`,
              acceptLabel: $localize`确定`,
              rejectLabel: $localize`取消`,
              accept: () => this.location.back(),
            });
          }
        });
      }
    });
  }

  // 上传图片
  uploadPic() {
    const path$ = new Subject<{mainImage: string, bannerBg: string}|null>();
    if (!this.mainImage || !this.bannerBg) {
      setTimeout(() => path$.next(null), 0);
    } else {
      zip([
        (!/^http/.test(this.mainImage)) ? this.net.postBaseImage$(this.mainImage) : new BehaviorSubject<TypeInterfaceNet>({code: 200, data: this.mainImage}),
        (!/^http/.test(this.bannerBg)) ? this.net.postBaseImage$(this.bannerBg) : new BehaviorSubject<TypeInterfaceNet>({code: 200, data: this.bannerBg}),
      ]).subscribe(async data => {
        await ToolFuncTimeSleep(0.001);
        if (data[0].code === 200 && data[1].code === 200) {
          path$.next({
            mainImage: data[0].data,
            bannerBg: data[1].data,
          });
        }
      });
    }
    return path$;
  }


  // 修改价格单位
  changeBuyToken(event: any) {
    this.selectedBuyToken = [event.itemValue];
  }
}
