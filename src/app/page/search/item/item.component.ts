import { Component, OnInit, Input } from '@angular/core';
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}
@Component({
  selector: 'gather-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class GatherItemComponent implements OnInit {
  @Input() item?: exploreItem;
  constructor() { }

  ngOnInit(): void {

  }

}
