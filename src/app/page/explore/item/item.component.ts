import { Component, OnInit, Input } from '@angular/core';
type CollectionOriginal = {
  CollectionID: string; // id
  Name:string;
  Image: string
}
type exploreItem = {
  BannerImageUrl:string;
  CollectionOriginal: CollectionOriginal;
}
@Component({
  selector: 'explore-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ExploreItemComponent implements OnInit {
  @Input() item?: exploreItem;
  constructor() { }

  ngOnInit(): void {

  }

}
