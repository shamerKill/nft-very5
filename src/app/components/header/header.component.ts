import { Component, OnInit } from '@angular/core';
import {MegaMenuItem,MenuItem} from 'primeng/api';

type TypeLinkList = {name: string; link: string}[];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
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

  // 关联钱包方法
  linkWallet() {
    if (this.hadAccount === false) {
      this.hadAccount = true;
    }
  }

}
