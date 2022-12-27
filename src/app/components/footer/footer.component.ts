import { nftTypesArr } from './../../server/database.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import '@angular/localize';

type TypeLinkList = {title: string; link: string, key?: string;type: number}[];

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
    link: 'explore',
    type: 0
  }));
  // NFT功能列表
  nftTitle = $localize`NFT`;
  nftFuncList: TypeLinkList = [
    {
      title: $localize`创建`,
      link: 'create/nft',
      type: 0
    },
    {
      title: $localize`推荐`,
      link: '',
      type: 0
    },
    {
      title: $localize`排行榜`,
      link: 'ranking-list',
      type: 0
    },
    {
      title: $localize`交易历史`,
      link: '',
      type: 0
    }
  ];
  // 友情链接
  friendsTitle = $localize`Links`;
  friendsLink: TypeLinkList = [
    {
      title: $localize`Plug Chain`,
      link: 'http://www.plugchain.info/',
      type: 1
    },
    {
      title: $localize`ONP`,
      link: 'http://www.onp.world/',
      type: 1
    },
    {
      title: $localize`Telegram`,
      link: 'https://t.me/plugchain',
      type: 1
    },
    {
      title: $localize`CMC`,
      link: 'https://coinmarketcap.com/currencies/plug-chain/',
      type: 1
    }
  ];
  goLink(link:string,type:number,key:string='') {
    if (type) {
      window.open(link)
    } else {
      if (key) {
        this.router.navigate([link],{queryParams:{id: key}});
      } else {
        this.router.navigate([link]);
      }
    }
  }
  projectName = environment.projectName;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {

  }

}
