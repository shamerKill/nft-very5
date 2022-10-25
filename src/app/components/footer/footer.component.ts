import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import '@angular/localize';

type TypeLinkList = {name: string; link: string}[];

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // 探索列表
  exploreTitle = $localize`探索`;
  exploreList: TypeLinkList = [
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
  // NFT功能列表
  nftTitle = $localize`NFT`;
  nftFuncList: TypeLinkList = [
    {
      name: $localize`创建`,
      link: '',
    },
    {
      name: $localize`推荐`,
      link: '',
    },
    {
      name: $localize`排行榜`,
      link: '',
    },
    {
      name: $localize`交易历史`,
      link: '',
    }
  ];
  // 友情链接
  friendsTitle = $localize`Links`;
  friendsLink: TypeLinkList = [
    {
      name: $localize`Plug Chain`,
      link: '',
    },
    {
      name: $localize`ONP`,
      link: '',
    },
    {
      name: $localize`Telegram`,
      link: '',
    },
    {
      name: $localize`CMC`,
      link: '',
    }
  ];

  projectName = environment.projectName;

  constructor() { }

  ngOnInit(): void {

  }

}
