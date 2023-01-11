import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Subject } from 'rxjs';
import { StateService } from './../../server/state.service';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { TypeFileEvent } from './../../components/choose-file/choose-file.component';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.scss']
})
export class CreateNftComponent extends ToolClassAutoClosePipe implements OnInit {

  /**
   * nft id 不为null表示为编辑
   **/
  productId: null|string = null;

  /**
   * 收藏品图片
   **/
  nftImage?: string;
  /**
   * 收藏品名称
   **/
  name = '';
  /**
   * 社交链接
   **/
   interactiveLink = '';
  /**
   * 描述
   **/
  describe = '';
  /**
   * 属性列表
   **/
  attributeList: {key: string, value: string}[] = [
    {key: '', value: ''}
  ];
  /**
   * 收藏品数量
   **/
  selectedNum: number = 1;
  /**
   * 选择的合集
   **/
  selectedCollectionId?: string;
  /**
   * 是否可以创建
   **/
  canCreate = false;

  // 合集列表
  collectionList: {
    id: string;
    image: string;
    name: string;
    describe: string;
    type: string;
  }[] = [];


  constructor(
    private message: BaseMessageService,
    private net: NetService,
    private state: StateService,
    private confirm: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super();
    this.route.params.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data['id']) {
        this.productId = data['id'];
        this.getEditNftInfo();
      } else {
        this.getMyCollection();
      }
    });
  }

  ngOnInit(): void {
  }
  // 如果是编辑nft的话，获取nft信息
  getEditNftInfo() {
    this.state.globalLoadingSwitch(true);
    this.state.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
      this.state.globalLoadingSwitch(false);
      if (!data.isLinking && data.accountAddress) {
        this.state.globalLoadingSwitch(true);
        this.net.getNftInfoById$(this.productId??'', data.accountAddress).pipe(this.pipeSwitch$()).subscribe(result => {
          this.state.globalLoadingSwitch(false);
          if (result.code !== 200) {
            this.message.warn($localize`获取数据失败`);
            return this.location.back();
          } else {
            const data = result.data.nft;
            this.name = data.NftOriginal.Name;
            this.nftImage = data.NftOriginal.Image;
            this.describe = data.NftOriginal.Description;
            this.selectedNum = data.CreatorNumber;
            this.interactiveLink = data.NftOriginal.ExternalURL;
            this.attributeList = JSON.parse(data.NftOriginal.Attributes).map((item: any) => {
              return {key: item.trait_type, value: item.value};
            }).filter((item: any) => item.key && item.value);
            // 根据id获取合集信息
            this.net.getCollectionDetail$(data.CollectionID).pipe(this.pipeSwitch$()).subscribe(collection => {
              if (collection.code !== 200) {
                this.message.warn($localize`获取数据失败`);
                return this.location.back();
              } else {
                this.collectionList.push({
                  id: data.CollectionID,
                  image: collection.data.ImageUrl,
                  name: collection.data.CollectionOriginal.Name,
                  describe: collection.data.CollectionOriginal.Description,
                  type: collection.data.collection,
                });
                this.selectedCollectionId = data.CollectionID;
              }
            });
          }
        });
      }
    });
  }

  // 获取我的合集
  private getMyCollection() {
    this.state.globalLoadingSwitch(true);
    this.net.getMyCollectionList$().pipe(this.pipeSwitch$()).subscribe(data => {
      this.state.globalLoadingSwitch(false);
      if (data.code === 200) {
        if (data.data && data.data.length) {
          this.collectionList = data.data.map((item: any) => {
            return {
              id: item.ID,
              image: item.ImageUrl,
              name: item.CollectionOriginal.Name,
              describe: item.CollectionOriginal.Description,
              type: item.Category,
            };
          });
          this.selectedCollectionId = this.collectionList[0].id;
        }
      } else {
        this.message.warn($localize`获取合集失败`);
      }
    });
  }

  // 添加属性列表
  addAttribute() {
    if (!this.attributeList.length || this.attributeList[this.attributeList.length - 1].key) {
      this.attributeList.push({key: '', value: ''});
    }
  }
  // 删除属性列表
  delAttribute(index: number) {
    let arr = [];
    for (let i = 0; i < this.attributeList.length; i++) {
      if (i !== index) arr.push(this.attributeList[i]);
    }
    this.attributeList = arr;
  }
  // 选择合集
  changeCollection(id: string) {
    if (this.productId) return;
    this.selectedCollectionId = id;
  }



  /**
   * 获取NFT base
   **/
   onGetNFTImage(file: TypeFileEvent) {
    if (file.error === 'size') {
      this.message.warn($localize`请检查图片尺寸`);
    } else if (file.error === 'type') {
      this.message.warn($localize`请检查文件类型`);
    }
    if (file.data) {
      this.nftImage = file.data;
      this.onListenData();
    }
  }

  /**
   * 收藏品名字监听
   **/
  onListenName(event: Event) {
    this.name = (event.target as HTMLInputElement)?.value;
    this.onListenData();
  }


  /**
   * 监听必要数据填写完成
   **/
   onListenData() {
    // 判定数据是否不为空
    if (
      this.name && this.nftImage && this.selectedNum && this.selectedCollectionId
    ) {
      this.canCreate = true;
    } else {
      this.canCreate = false
    }
  }

  /**
   * 创建合集
   **/
   onCreateNft() {
    // TODO: 需要判断数据是否可以执行
    this.state.globalLoadingSwitch(true);
    // 上传图片
    this.uploadPic().subscribe((image) => {
      if (!image) {
        this.state.globalLoadingSwitch(false);
        this.message.warn($localize`图片上传失败`);
        return;
      }
      if (this.productId) {
        this.editNft(image.path);
      } else {
        this.createNft(image.path);
      }
    });
  }

  // 上传图片
  uploadPic() {
    const path$ = new Subject<{path: string}|null>();
    if (!this.nftImage) {
      setTimeout(() => path$.next(null), 0);
    } else if (/^http/.test(this.nftImage)) {
      setTimeout(() => path$.next({path: this.nftImage!}), 0);
    } else {
      this.net.postBaseImage$(this.nftImage).subscribe(data => {
        if (data.code === 200) {
          path$.next({ path: data.data });
        }
      });
    }
    return path$;
  }

  // 创建nft
  createNft(image: string) {
    let traitArr = this.attributeList.filter(item => item.key && item.value).map(({key, value}) => {return {trait_type: key,value:value}});
    this.net.putNewNFT$({
      name: this.name,
      image: image,
      external_link: this.interactiveLink,
      description: this.describe,
      attr: JSON.stringify(traitArr),
      number: this.selectedNum.toString(),
      collection_id: this.selectedCollectionId??'',
    }).pipe(this.pipeSwitch$()).subscribe(data => {
      this.state.globalLoadingSwitch(false);
      if (data.code !== 200) return this.message.warn(data.msg ?? $localize`创建失败`);
      this.message.success($localize`创建成功`);
      this.confirm.confirm({
        header: $localize`创建提示`,
        message: $localize`是否继续创建新的收藏品？`,
        acceptLabel: $localize`确定`,
        rejectLabel: $localize`取消`,
        accept: () => {
          this.name = '';
          this.nftImage = '',
          this.canCreate = false;
        },
        reject: () => {
          this.state.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
            this.router.navigate(['user'],{queryParams:{id: data.accountAddress}})
          })
        },
      });
    });
  }

  // 修改nft
  editNft(image: string) {
    this.net.postEditNFT$({
      id: this.productId??'',
      name: this.name,
      image: image,
      external_link: this.interactiveLink,
      description: this.describe,
      attr: this.attributeList.map(({key, value}) => `${key}:${value}`).join(','),
    }).pipe(this.pipeSwitch$()).subscribe(data => {
      this.state.globalLoadingSwitch(false);
      if (data.code !== 200) return this.message.warn(data.msg ?? $localize`修改失败`);
      this.message.success($localize`修改成功`);
      this.location.back();
    });
  }

}
