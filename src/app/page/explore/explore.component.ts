import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { nftTypesArr } from './../../server/database.service';
import { StateService } from './../../server/state.service';
import '@angular/localize';
interface pageObj {
  first: number,
  page: number,
  pageCount: number,
  rows: number,
}
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
export class ExploreComponent implements OnInit,OnDestroy {
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
  public total!: number;
  public page!: number;
  public pageSize!: number;
  changeIndex(i:number) {
    this.tabbarIndex = i;
    this.classId = this.tabbar[this.tabbarIndex].id;
    this.pageSize = 10;
    this.total = 0;
    this.page = 1;
    this.getList();
  }
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private state: StateService,
  ) {
  }
  navigationSubscription:any;
  ngOnInit(): void {
    this.state.globalLoadingSwitch(true);
    this.tabbar.map((item,index) => {
      if (item.id == this.routerInfo.snapshot.queryParams['id']) {
        this.tabbarIndex = index
      }
    })
    this.classId = this.tabbar[this.tabbarIndex].id;
    this.getList();
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.state.globalLoadingSwitch(true);
        this.tabbar.map((item,index) => {
          if (item.id == this.routerInfo.snapshot.queryParams['id']) {
            this.tabbarIndex = index
          }
        })
        this.classId = this.tabbar[this.tabbarIndex].id;
        this.getList();
      }
    });
  }
  ngOnDestroy():void{
    this.navigationSubscription.unsubscribe()
  }
  paginate(e:pageObj){
    this.pageSize = e.rows;
    this.page = e.page+1;
    this.getList();
  }
  getList() {
    // 获取数据
    this.net.getCollectionList$('',this.classId,this.page,this.pageSize).pipe().subscribe(({code, data, msg}) => {
      this.state.globalLoadingSwitch(false);
      console.log(code)
      if (code !== 200) return this.BaseMessage.warn(msg??'');
      if (Array.isArray(data.collections) && data.collections.length) {
        this.exploreList = data.collections
        this.total = data.count
      } else {
        this.exploreList = []
      }
    });
  }
}
