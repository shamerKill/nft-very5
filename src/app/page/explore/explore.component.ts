import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { nftTypesArr } from './../../server/database.service';
import '@angular/localize';

type tabbarItem = {name: string; id: string}[];
type exploreItem = {
  BannerImageUrl:string,
  CollectionOriginal: {
    CollectionID: string, // id
    Name:string,
    Image: string
  };
}
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent extends ToolClassAutoClosePipe implements OnInit {
  tabbar: tabbarItem = [
    {
      name: $localize`全部`,
      id: ''
    }
  ].concat(
    nftTypesArr.map(item => ({
      name: item.title,
      id: item.key,
    })));
  tabbarIndex: number = 0;
  exploreList: exploreItem[] = [];
  classId: string = '';
  changeIndex(i:number) {
    this.tabbarIndex = i;
    this.classId = this.tabbar[this.tabbarIndex].id;
    this.getList();
  }
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.tabbar.map((item,index) => {
      if (item.id == this.routerInfo.snapshot.queryParams['id']) {
        this.tabbarIndex = index
      }
    })
    this.classId = this.tabbar[this.tabbarIndex].id;
    this.getList();
  }
  getList() {
    // 获取数据
    this.net.getCollectionList$('',this.classId).pipe(this.pipeSwitch$()).subscribe(({code, data, msg}) => {
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data) && data.length) {
        this.exploreList = data
      } else {
        this.exploreList = []
      }
    });
  }
}
