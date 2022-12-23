import { DatabaseService } from './../../server/database.service';
import { ToolFuncTimeSleep } from 'src/app/tools/functions/time';
import { Subject } from 'rxjs';
import { StateService } from './../../server/state.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { TypeFileEvent } from './../../components/choose-file/choose-file.component';
import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';

@Component({
  selector: 'app-my-setting',
  templateUrl: './my-setting.component.html',
  styleUrls: ['./my-setting.component.scss']
})
export class MySettingComponent extends ToolClassAutoClosePipe implements OnInit {
  /**
   * 用户头像
   **/
  userAvatar?: string;
  avatarChanged = false;
  /**
   * 主页封面图
   **/
  mainBg?: string;
  mainChanged = false;
  /**
   * 用户名
   **/
  userNickname?: string;
  /**
   * 简介
   **/
  userDescribe?: string;
  /**
   * 链接
   **/
  userWebSite: {[key: string]: string|undefined} = {};

  /**
   * 是否在加载中
   **/
  isLoading = false;

  constructor(
    private message: BaseMessageService,
    private net: NetService,
    private state: StateService,
    private database: DatabaseService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.state.linkedWallet$.subscribe(data => {
      if (data.isLinked) this.getUserInfo();
    });
    this.state.globalLoading$.subscribe(type => this.isLoading = (type > 0));
  }

  // 获取用户信息
  private getUserInfo() {
    this.state.globalLoadingSwitch(true);
    this.net.getNowUserInfo$();
    this.database.nowUserInfo$.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data != null) {
        this.state.globalLoadingSwitch(false);
        this.userAvatar = data.avatar??'';
        this.mainBg = data.mainBg??'';
        this.userNickname = data.name??'';
        this.userDescribe = data.describe??'';
        this.userWebSite = data.link||{};
      }
    });
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
      this.avatarChanged = true;
    }
  }

  /**
   * 获取封面图base
   **/
  onGetMainBg(file: TypeFileEvent) {
    if (file.error === 'size') {
      this.message.warn($localize`请检查图片尺寸`);
    } else if (file.error === 'type') {
      this.message.warn($localize`请检查文件类型`);
    }
    if (file.data) {
      this.mainBg = file.data;
      this.mainChanged = true;
    }
  }

  /**
   * 进行提交
   **/
  onPostUpdate() {
    this.state.globalLoadingSwitch(true);
    // 上传图片
    this.uploadPic().subscribe(data => {
      this.uploadData(data).subscribe(res => {
        this.state.globalLoadingSwitch(false);
        if (res.code !== 200) return this.message.warn(res.msg??'');
        if (res.code === 200) {
          this.message.success($localize`提交成功`);
          // 更新数据
          this.net.getNowUserInfo$().pipe(this.pipeSwitch$()).subscribe();
        }
      });
    });
  }
  // 上传图片
  uploadPic() {
    return zip((() => {
      const arr = [];
      if (this.avatarChanged && this.userAvatar) arr.push(this.net.postBaseImage$(this.userAvatar));
      if (this.mainChanged && this.mainBg) arr.push(this.net.postBaseImage$(this.mainBg));
      return arr;
    })()).pipe((sub) => {
      const path$ = new Subject<{avatar?: string, main?: string}>();
      if (!this.avatarChanged && !this.mainChanged) {
        ToolFuncTimeSleep(0.1).then(() => {
          path$.next({});
        });
      }
      sub.subscribe(data => {
        if (this.avatarChanged && this.mainBg) {
          const [avatar, main] = data;
          if (avatar.code === 200 && main.code === 200) {
            path$.next({
              avatar: avatar.data,
              main: main.data,
            });
          }
        } else if (this.avatarChanged) {
          const [avatar] = data;
          if (avatar.code === 200) {
            path$.next({
              avatar: avatar.data,
            });
          }
        } else if (this.mainBg) {
          const [main] = data;
          if (main.code === 200) {
            path$.next({
              avatar: main.data,
            });
          }
        }
      });
      return path$;
    });
  }
  // 上传参数
  uploadData(picPath: {
    avatar?: string | undefined;
    main?: string | undefined;
  }) {
    return this.net.putNowUserInfo$({
      name: this.userNickname,
      avator: picPath.avatar,
      conver: picPath.main,
      description: this.userDescribe,
      link: JSON.stringify({
        homeSite: this.userWebSite['homeSite'],
        twitter: this.userWebSite['twitter'],
        telegram: this.userWebSite['telegram'],
      })
    });
  }

}
