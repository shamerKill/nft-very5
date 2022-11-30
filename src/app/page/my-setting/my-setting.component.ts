import { BaseMessageService } from './../../server/base-message.service';
import { TypeFileEvent } from './../../components/choose-file/choose-file.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-my-setting',
  templateUrl: './my-setting.component.html',
  styleUrls: ['./my-setting.component.scss']
})
export class MySettingComponent implements OnInit {
  /**
   * 用户头像
   **/
  userAvatar: string = '';
  /**
   * 主页封面图
   **/
  mainBg: string = '';

  constructor(
    private message: BaseMessageService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * 获取头像base
   **/
  onGetAvatar(file: TypeFileEvent) {
    if (file.error === 'size') {
      this.message.warn($localize`请检查图片尺寸`);
    } else if (file.error === 'type') {
      this.message.warn($localize`请检查文件类型`);
    }
    if (file.data) {
      this.userAvatar = file.data;
    }
  }

  /**
   * 获取封面图base
   **/
  onGetMainBg(file: TypeFileEvent) {
    console.log(file);
    if (file.error === 'size') {
      this.message.warn($localize`请检查图片尺寸`);
    } else if (file.error === 'type') {
      this.message.warn($localize`请检查文件类型`);
    }
    if (file.data) {
      this.mainBg = file.data;
    }
  }


}
