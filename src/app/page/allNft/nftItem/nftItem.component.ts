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

}
