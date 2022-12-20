import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
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
    },{
      name: $localize`热门`,
      id: '热门'
    },
    {
      name: $localize`最佳`,
      id: '最佳'
    },
    {
      name: $localize`艺术`,
      id: '艺术'
    },
    {
      name: $localize`收藏品`,
      id: '收藏品'
    },
    {
      name: $localize`实用`,
      id: '实用'
    },
    {
      name: $localize`卡片`,
      id: '卡片'
    },
    {
      name: $localize`虚拟世界`,
      id: '虚拟世界'
    },
    {
      name: $localize`音乐`,
      id: '音乐'
    },
    {
      name: $localize`体育`,
      id: '体育'
    },
    {
      name: $localize`域名`,
      id: '域名'
    },
  ];
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
      this.exploreList = data
    });
  }
}
