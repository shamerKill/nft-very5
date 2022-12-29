import { Component, OnInit,Input } from '@angular/core';
type exploreItem = {
  name: string;
  headImg: string;
  img: string;
  id: string;
}
@Component({
  selector: 'app-search-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() item?: exploreItem;
  constructor() { }

  ngOnInit(): void {
  }

}
