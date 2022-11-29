import { DatabaseService } from './../../server/database.service';
import { BehaviorSubject } from 'rxjs';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { StateService } from './../../server/state.service';
import { ToolFuncLinkWallet } from 'src/app/tools/functions/wallet';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { ToolFuncTimeSleep } from 'src/app/tools/functions/time';

type TypeLinkList = {name: string; link: string}[];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends ToolClassAutoClosePipe implements OnInit {

  @ViewChild('comHeader')
  headerContent?: ElementRef<HTMLDivElement>;
  @ViewChild('webMenuContent')
  menuContent?: ElementRef<HTMLDivElement>;

  // 搜索内容
  searchText: string = '';
  // 展示列表
  items: MegaMenuItem[] = [];
  // 是否关联了钱包
  hadAccount: boolean = false;
  // 账户头像
  accountAvatar?: string;
  // 是否显示web菜单 0不显示 1首页 2探索 3语言
  webMenuType$ = new BehaviorSubject(0);
  webMenuType = this.webMenuType$.value;

  exploreList: TypeLinkList = [
    {
      name: $localize`全部`,
      link: '',
    },
    {
      name: $localize`艺术`,
      link: '',
    },
    {
      name: $localize`收藏品`,
      link: '',
    },
    {
      name: $localize`实用`,
      link: '',
    },
    {
      name: $localize`卡片`,
      link: '',
    },
    {
      name: $localize`虚拟世界`,
      link: '',
    },
    {
      name: $localize`音乐`,
      link: '',
    },
    {
      name: $localize`体育`,
      link: '',
    },
    {
      name: $localize`域名`,
      link: '',
    }
  ];

  constructor(
    public stateService: StateService,
    public appService: DatabaseService,
    private BaseMessage: BaseMessageService,
    private netService: NetService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.listenWalletInfo();
    this.initMenu();
    this.checkLoginType();
    this.webMenuType$.pipe(this.pipeSwitch$()).subscribe((value) => {
      this.webMenuType = value;
      this.setWebMenuHeight();
    });
    this.stateService.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
      this.hadAccount = data.isLinked;
    });
  }

  initMenu() {
    this.items = [
      {
        label: $localize`探索`,
        items: [
          this.exploreList.map<MenuItem>(
            item => ({
              items: [{label: item.name}]
            })
          )
        ],
      },
      {
        label: $localize`排行榜`,
        command: console.log
      },
      {
        label: $localize`创造NFT`
      },
      {
        icon: 'pi pi-globe',
        items: [
          [
            { items: [{label: $localize`English`}] },
            { items: [{label: $localize`简体中文`}] },
          ]
        ]
      },
    ];
  }

  /**
   * 判断是否已经登录
   **/
  private async checkLoginType() {
    await ToolFuncTimeSleep(1);
    const result = await ToolFuncLinkWallet(this.netService.signLogin$.bind(this.netService), true);
    if (result?.accountAddress !== null) {
      this.netService.getMyNFTList$().pipe(this.pipeSwitch$()).subscribe(({code}) => {
        if (code === 200 && result) {
          result.isLinked = true;
          this.stateService.linkedWallet$.next(result);
        }
      });
    }
  }

  /**
   * 监听账户信息
  **/
  private listenWalletInfo() {
    this.stateService.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
      this.hadAccount = data.isLinked;
    });
  }

  /**
   * 关联钱包方法
  **/
  async onLinkWallet() {
    this.stateService.globalLoadingSwitch(true);
    // this指向修改
    const result = await ToolFuncLinkWallet(this.netService.signLogin$.bind(this.netService));
    this.stateService.globalLoadingSwitch(false);
    if (result == null) {
      this.BaseMessage.warn($localize`获取账户失败`);
      return;
    }
    this.stateService.linkedWallet$.next(result);
  }

  /**
   * 展示个人菜单栏
   **/
  onSwitchUserMenu() {
    this.stateService.userMenuState$.next(
      !this.stateService.userMenuState$.value
    );
  }

  /**
   * 修改web侧边栏状态
   **/
  onChangeWebMenuType(index: number) {
    this.webMenuType$.next(index);
  }

  // 侧边栏高度调整
  async setWebMenuHeight() {
    await ToolFuncTimeSleep(0.1);
    const headerHeight = this.headerContent?.nativeElement.clientHeight || 0;
    const bodyHeight = document.body.clientHeight;
    // 获取body滚动距离
    const bodyScroll = document.body.scrollTop;
    if (this.menuContent) {
      this.menuContent.nativeElement.style.height = (
        bodyHeight - headerHeight + bodyScroll
      ) + 'px';
      this.menuContent.nativeElement.style.top = (headerHeight - bodyScroll) + 'px';
    }
  }

}
