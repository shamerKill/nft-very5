import { DatabaseService } from './../../server/database.service';
import { BaseMessageService } from './../../server/base-message.service';
import { NetService } from './../../server/net.service';
import { ToolFuncTimeSleep } from './../../tools/functions/time';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { StateService, accountStoreInit } from './../../server/state.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Router } from '@angular/router';
import { ToolFuncNumberDiv } from 'src/app/tools/functions/number';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent extends ToolClassAutoClosePipe implements OnInit {

  @ViewChild('content')
  content?: ElementRef<HTMLDivElement>;

  /**
   * 用户信息
   **/
  userInfo = {
    avatar: '',
    name: '--',
    address: '',
  };
  /**
   * 币种信息
   **/
  tokenInfo = {
    name: 'PC',
    logo: '../../../assets/images/home/plug-logo.png',
  };
  /**
   * 持币数量
   **/
  tokenNumber = {
    base: '0',
    usd: '0',
  }

  constructor(
    public stateService: StateService,
    private clipboard: ClipboardService,
    private net: NetService,
    private baseMessage: BaseMessageService,
    private router: Router,
    private database: DatabaseService,
  ) {
    super();
    this.stateService.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data.accountAddress) this.userInfo.address = data.accountAddress;
    });
  }

  ngOnInit(): void {
    this.stateService.userMenuState$.pipe(this.pipeSwitch$()).subscribe(state => {
      this.settingContentHeight(state);
    });
    this.listenUserInfo();
  }

  // 监听用户信息
  private listenUserInfo() {
    this.database.nowUserInfo$.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data?.avatar) this.userInfo.avatar = data.avatar;
      if (data?.name) this.userInfo.name = data.name;
      if (data?.balance) this.tokenNumber.base = ToolFuncNumberDiv(data.balance, (10**6).toString(), { places: 6 });
      if (data?.balanceDollar) this.tokenNumber.usd = data.balanceDollar;
    });
  }

  // 设置内容框高度
  private async settingContentHeight(state: boolean) {
    for (let i = 0; i < 100; i++) {
      await ToolFuncTimeSleep(0.1);
      if (this.content) break;
    }
    if (!this.content) return;
    if (!state) {
    }
    // 获取body的高度
    const bodyHeight = document.body.clientHeight;
    // 获取body滚动距离
    const bodyScroll = document.body.scrollTop;
    // 获取头部的高度
    const headerHeight = document.querySelector('app-header')?.clientHeight || 0;
    // 设置内容高度
    this.content.nativeElement.style.height = (bodyHeight - headerHeight + bodyScroll) + 'px';
    this.content.nativeElement.style.top = (headerHeight - bodyScroll) + 'px';
  }

  // 监听复制状态

  /**
   * 关闭弹窗
   **/
  onCloseMenu() {
    this.stateService.userMenuState$.next(false);
  }

  /**
   * 组织冒泡
   **/
  onStopEvent(event: MouseEvent) {
    event.stopPropagation();
    return false;
  }

  /**
   * 复制
   **/
  onCopy(input: string) {
    this.clipboard.copy(input);
  }

  /**
   * 前往页面
   **/
  onGoToPage(page: string, queryParams?: {[key: string]: string}) {
    this.stateService.userMenuState$.next(false);
    this.router.navigate([page], { queryParams });
  }

  /**
   * 退出登录
   **/
  async onOutLinkWallet() {
    this.net.outLogin$().subscribe(data => {
      if (data.code === 200) {
        this.baseMessage.success($localize`退出成功`);
        this.stateService.linkedWallet$.next(accountStoreInit);
        this.stateService.userMenuState$.next(false);
      } else {
        this.baseMessage.warn($localize`退出失败`);
      }
    });
  }

}
