import { Component, OnInit, Input } from '@angular/core';
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}[]

@Component({
  selector: 'nft-item',
  templateUrl: './nftItem.component.html',
  styleUrls: ['./nftItem.component.scss']
})
export class NftItemComponent implements OnInit {
  @Input() type:number = 1;
  constructor() {
  }
  ngOnInit(): void {
  }

}
