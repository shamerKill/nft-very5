import { Component, OnInit,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import '@angular/localize';
import { BehaviorSubject, debounceTime, fromEvent, zip } from 'rxjs';
import SwiperCore, { Pagination } from "swiper";
import { ActivatedRoute } from '@angular/router';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { StateService } from './../../server/state.service';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends ToolClassAutoClosePipe implements OnInit,AfterViewInit {
  @ViewChild('searchInput')
  searchContent?: ElementRef<HTMLInputElement>;

  // 搜索结果
  searchResult: {
    [key in 'nft'|'collection'|'user']: {
      id: string;
      headImg: string;
      name: string;
      describe: string;
      img: string;
    }[];
  } & {loading: boolean; selected: number;} = {
    selected: 0,
    loading: false,
    nft: [],
    collection: [],
    user: [],
  };
  listType:number=1;
  switchList(type:number) {
    this.listType = type;
  };
  constructor(
    private net: NetService,
    private BaseMessage: BaseMessageService,
    private routerInfo: ActivatedRoute,
    private state: StateService,
  ) {
    super();
  }
  searchText: string='';
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.addSearchListen();
  }

  // 添加search监听
  private addSearchListen() {
    if (this.searchContent) {
      let timer: number;
      fromEvent(this.searchContent.nativeElement, 'input').pipe(
        debounceTime(1000)
      ).subscribe(data => {
        const target = data.target as HTMLInputElement;
        if (target.value === '') {
          clearTimeout(timer);
          this.searchResult = {
            selected: 0,
            loading: false,
            nft: [],
            collection: [],
            user: []
          };
        }
        if (this.searchResult.loading) {
          clearTimeout(timer);
          timer = setInterval(() => {
            if (!this.searchResult.loading) {
              this.searchFromNet(target.value);
              clearTimeout(timer);
            }
          }, 1000) as unknown as number;
        } else {
          this.searchFromNet(target.value);
        }
      });
    }
  }
  // 搜索内容
  private searchFromNet(value: string) {
    this.searchResult.loading = true;
    this.state.globalLoadingSwitch(true);
    zip([
      this.net.getSearchContent$('nft', value),
      this.net.getSearchContent$('collection', value),
      this.net.getSearchContent$('user', value),
    ]).subscribe(([nft, collection, user]) => {
      this.searchResult.loading = false;
      this.state.globalLoadingSwitch(false);
      this.searchResult.nft = [];
      this.searchResult.collection = [];
      this.searchResult.user = [];
      if (nft.code === 200 && nft.data && nft.data.length) {
        this.searchResult.nft = nft.data.map((item: any) => {
          return {
            id: item.NftID,
            headImg: item.Image||'assets/images/logo/default-avatar@2x.png',
            name: item.Name,
            describe: item.Description,
          };
        });
      }
      if (collection.code === 200 && collection.data && collection.data.length) {
        this.searchResult.collection = collection.data.map((item: any) => {
          return {
            id: item.CollectionID,
            headImg: item.Image||'assets/images/logo/default-avatar@2x.png',
            name: item.Name,
            describe: item.Description,
          };
        });
      }
      if (user.code === 200 && user.data && user.data.length) {
        this.searchResult.user = user.data.map((item: any) => {
          return {
            id: item.Address,
            headImg: item.Avator||'assets/images/logo/default-avatar@2x.png',
            name: item.Name,
            describe: item.Description,
          };
        });
      }
      if (this.searchResult.nft.length) {
        this.searchResult.selected = 1;
      } else if (this.searchResult.collection.length) {
        this.searchResult.selected = 2;
      } else if (this.searchResult.user.length) {
        this.searchResult.selected = 3;
      } else {
        this.searchResult.selected = 0;
      }
    });
  }
}
