import { nftTypesArr } from './../../server/database.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import '@angular/localize';

type TypeLinkList = {title: string; link: string, key?: string}[];

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // 探索列表
  exploreTitle = $localize`探索`;
  exploreList: TypeLinkList = nftTypesArr.map(item => ({
    ...item,
    link: '',
  }));
  // NFT功能列表
  nftTitle = $localize`NFT`;
  nftFuncList: TypeLinkList = [
    {
      title: $localize`创建`,
      link: '',
    },
    {
      title: $localize`推荐`,
      link: '',
    },
    {
      title: $localize`排行榜`,
      link: '',
    },
    {
      title: $localize`交易历史`,
      link: '',
    }
  ];
  // 友情链接
  friendsTitle = $localize`Links`;
  friendsLink: TypeLinkList = [
    {
      title: $localize`Plug Chain`,
      link: '',
    },
    {
      title: $localize`ONP`,
      link: '',
    },
    {
      title: $localize`Telegram`,
      link: '',
    },
    {
      title: $localize`CMC`,
      link: '',
    }
  ];

  projectName = environment.projectName;

  constructor() { }

  ngOnInit(): void {

  }

}
