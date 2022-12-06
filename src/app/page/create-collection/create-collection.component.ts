import { ConfirmationService } from 'primeng/api';
import { StateService } from './../../server/state.service';
import { Subject } from 'rxjs';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { NetService } from './../../server/net.service';
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

  // tokens: {name: string}[];
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

  // 创建完是否需要返回上一级
  createdBack?: string;

  constructor(
    private message: BaseMessageService,
    private net: NetService,
    private state: StateService,
    private location: Location,
    private route: ActivatedRoute,
    private confirm: ConfirmationService,
  ) {
    super();
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
  }
  ngAfterViewInit(): void {
    document.body.scrollTop = 0;
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
      this.profit.rate && this.typeSelected.length
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
      this.net.putNewCollection$({
        name: this.name,
        image: images.mainImage,
        banner_image: images.bannerBg,
        external_link: this.interactiveLink,
        creator_rate: this.profit.rate,
        fee_recipient: this.profit.address,
        category: this.typeSelected[0].key,
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
    });
  }

  // 上传图片
  uploadPic() {
    const path$ = new Subject<{mainImage: string, bannerBg: string}>();
    if (!this.mainImage || !this.bannerBg) return path$;
    return zip([
      this.net.postBaseImage$(this.mainImage),
      this.net.postBaseImage$(this.bannerBg),
    ]).pipe((sub) => {
      sub.subscribe(data => {
        if (data[0].code === 200 && data[1].code === 200) {
          path$.next({
            mainImage: data[0].data,
            bannerBg: data[1].data,
          });
        }
      });
      return path$;
    });
  }
}
