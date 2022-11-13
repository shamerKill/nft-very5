import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.scss']
})
export class SellNftComponent implements OnInit {

  // 收藏品ID
  productId: string = '';
  // nft信息
  productInfo = {
    image: '../../../assets/images/cache/home/矩形 5.png',
    name: 'Geek Dude',
    owner: 'Dude',
    id: '87534',
    describe: 'Honorary members of the Bored Ape Yacht Club.',
    // 收藏者数量
    followerVol: 100,
    // 创建者
    creator: {
      name: 'BAYCTRONICS',
      logo: '../../../assets/images/cache/home/矩形 12 拷贝.png',
    },
    // 创建者抽成
    incomeRate: '0.1%',
    // 所在合集
    collection: {
      name: 'NEW COLLECTION',
      describe: 'Honorary members of the Bored Ape Yacht Club.',
      id: '123',
    },
    // 上链信息
    infoInChain: {
      contractAddress: 'gx1gjxs8ygvlur2cekxajdnhkl4tkf2vl478w3ew0',
      tokenId: '12394',
      sourceData: 'lkxczjvoiasjdf;laksjdgoasidjglksajvkljxzcovkjoiasjglkasjdgiojqwiejklasjvioasfj',
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
