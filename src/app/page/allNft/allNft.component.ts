import { Component, OnInit } from '@angular/core';
import '@angular/localize';

type tabbarItem = {name: string; id: string}[];
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}[]
@Component({
  selector: 'app-allNft',
  templateUrl: './allNft.component.html',
  styleUrls: ['./allNft.component.scss']
})
export class AllNftComponent implements OnInit {
  tabbar: tabbarItem = [
    {
      name: $localize`热门`,
      id: '1'
    },
    {
      name: $localize`最佳`,
      id: '2'
    },
    {
      name: $localize`艺术`,
      id: '3'
    },
    {
      name: $localize`收藏品`,
      id: '4'
    },
    {
      name: $localize`实用`,
      id: '5'
    },
  ];
  tabbarIndex: number = 0;
  exploreList: exploreItem = [
    {
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb.jpeg',
      id: '1'
    },{
      name: 'NFT Brtod',
      headImg: '../../../assets/images/explore/imgs.png',
      img: '../../../assets/images/explore/sb1.jpeg',
      id: '2'
    }
  ];
  changeIndex(i:number) {
    this.tabbarIndex = i;
  }
  constructor() {
  }

  ngOnInit(): void {
  }

}
