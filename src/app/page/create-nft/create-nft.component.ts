import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Subject } from 'rxjs';
import { StateService } from './../../server/state.service';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { TypeFileEvent } from './../../components/choose-file/choose-file.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.scss']
})
export class CreateNftComponent extends ToolClassAutoClosePipe implements OnInit {

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
  ) {
    super();
  }

  ngOnInit(): void {
    this.getMyCollection();
  }

  // 获取我的合集
  private getMyCollection() {
    this.state.globalLoadingSwitch(true);
    this.net.getMyCollectionList$().pipe(this.pipeSwitch$()).subscribe(data => {
      this.state.globalLoadingSwitch(false);
      if (data.code === 200) {
        if (data.data) {
          this.collectionList = data.data.map((item: any) => {
            return {
              id: item.CollectionOriginal.CollectionID,
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
    this.uploadPic().subscribe(({path}) => {
      this.net.putNewNFT$({
        name: this.name,
        image: path,
        external_link: this.interactiveLink,
        description: this.describe,
        attr: this.attributeList.map(({key, value}) => `${key}:${value}`).join(','),
        number: this.selectedNum.toString(),
        collection_id: this.selectedCollectionId??'',
      }).pipe(this.pipeSwitch$()).subscribe(data => {
        this.state.globalLoadingSwitch(false);
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
          reject: () => this.router.navigate([]),
        });
      });
    });
  }

  // 上传图片
  uploadPic() {
    const path$ = new Subject<{path: string}>();
    if (!this.nftImage) return path$;
    this.net.postBaseImage$(this.nftImage).subscribe(data => {
      if (data.code === 200) {
        path$.next({ path: data.data });
      }
    });
    return path$;
  }

}
