import { Component, OnInit, Input } from '@angular/core';
type CollectionOriginal = {
  CollectionID: string; // id
  Name:string;
  Image: string
}
type exploreItem = {
  BannerImageUrl:string;
  CollectionOriginal: CollectionOriginal;
  ImageUrl?:string;
  ID:string;
}
@Component({
  selector: 'explore-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ExploreItemComponent implements OnInit {
  @Input() item: exploreItem={
    BannerImageUrl:'',
    ID: '',
    CollectionOriginal: {
      CollectionID: '',
      Name:'',
      Image: '',
    },
    ImageUrl:'',
  };
  constructor() { }

  ngOnInit(): void {
  }

}
