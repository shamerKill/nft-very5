import { Component, OnInit, Input } from '@angular/core';
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
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
