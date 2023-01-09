import { Component, OnInit, Input } from '@angular/core';
type NftOriginal= {
  Name: string; // nft名称
  NftID: string|number;
  Image: string; // nft图片
}
type nftItem = {
  Sellinglype:string|number; // 正在售卖类型（1：一口价,2拍卖）
  CollectionName: string; // 集合名称
  CollectionID: string|number;
  NftOriginal: NftOriginal;
  CurrentPrice: string|number;
  SellCoinType?:string;
  SellCoinNumber?:string;
}

@Component({
  selector: 'nft-item',
  templateUrl: './nftItem.component.html',
  styleUrls: ['./nftItem.component.scss']
})
export class NftItemComponent implements OnInit {
  @Input() type:number = 1;
  @Input() item:nftItem={
    Sellinglype:'',
    CollectionName:'',
    CollectionID:'',
    NftOriginal: {
      Name:'',
      NftID:'',
      Image:'',
    },
    CurrentPrice: '',
  };
  constructor() {
  }
  ngOnInit(): void {
  }
  returnInfo(coin:string,type:number=0) {
    if (!coin) return '';
    let coinList:any = JSON.parse(window.localStorage.getItem('coinList')??'');
    let hasCoin = false;
    let coinInfo = {
      Decimals: 0,
      ID: 0,
      Logo: '',
      Name: '',
      Token: ''
    }
    coinList.map((item:any) => {
      if (item.Token == coin) {
        hasCoin = true;
        coinInfo = item;
      }
    })
    if (hasCoin) {
      if (type==1) {
        return coinInfo.Name
      } else {
        return coinInfo.Logo
      }
    }
    else return ''
  }
}
