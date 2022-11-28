import { BaseMessageService } from './../../server/base-message.service';
import { NetService } from './../../server/net.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { StateService } from './../../server/state.service';
import { Component, OnInit } from '@angular/core';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { ToolFuncLinkWallet } from 'src/app/tools/functions/wallet';
import { filter } from 'rxjs';

type TypeLinkList = {name: string; link: string}[];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends ToolClassAutoClosePipe implements OnInit {

  // 搜索内容
  searchText: string = '';
  // 展示列表
  items: MegaMenuItem[] = [];
  // 是否关联了钱包
  hadAccount: boolean = false;
  // 账户头像
  accountAvatar?: string

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
    private BaseMessage: BaseMessageService,
    private netService: NetService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.listenWalletInfo();
    this.initMenu();
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

}
