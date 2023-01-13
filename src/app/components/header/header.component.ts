import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DatabaseService, nftTypesArr } from './../../server/database.service';
import { BehaviorSubject, debounceTime, filter, fromEvent, zip } from 'rxjs';
import { NetService } from './../../server/net.service';
import { BaseMessageService } from './../../server/base-message.service';
import { StateService, accountStoreInit } from './../../server/state.service';
import { ToolFuncLinkWallet } from 'src/app/tools/functions/wallet';
import { ToolClassAutoClosePipe } from './../../tools/classes/pipe-close';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { ToolFuncTimeSleep } from 'src/app/tools/functions/time';
import { OverlayPanel } from 'primeng/overlaypanel';

type TypeLinkList = {title: string; link: string, key: string}[];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends ToolClassAutoClosePipe implements OnInit, AfterViewInit {

  @ViewChild('comHeader')
  headerContent?: ElementRef<HTMLDivElement>;
  @ViewChild('webMenuContent')
  menuContent?: ElementRef<HTMLDivElement>;

  @ViewChild('searchInput')
  searchContent?: ElementRef<HTMLInputElement>;
  @ViewChild('searchTip')
  searchTip?: OverlayPanel;
  // searchTip宽度
  searchTipWidth = 0;

  // 搜索内容
  searchText: string = '';
  // 展示列表
  items: MegaMenuItem[] = [];
  // 是否关联了钱包
  hadAccount: boolean = false;
  // 账户头像
  accountAvatar?: string;
  // 是否显示web菜单 0不显示 1首页 2探索 3语言
  webMenuType$ = new BehaviorSubject(0);
  webMenuType = this.webMenuType$.value;

  exploreList: TypeLinkList = [
    {
      title: $localize`所有NFT`,
      key: '',
      link: '',
    }
  ].concat(
    nftTypesArr.map(item => ({
      ...item,
      link: '',
    }))
  );

  // 搜索结果
  searchResult: {
    [key in 'nft'|'collection'|'user']: {
      id: string;
      logo: string;
      name: string;
      describe: string;
    }[];
  } & {loading: boolean; selected: number;} = {
    selected: 0,
    loading: false,
    nft: [],
    collection: [],
    user: [],
  };

  constructor(
    public stateService: StateService,
    public appService: DatabaseService,
    private BaseMessage: BaseMessageService,
    private netService: NetService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.listenWalletInfo();
    this.initMenu();
    this.checkLoginType();
    this.webMenuType$.pipe(this.pipeSwitch$()).subscribe((value) => {
      this.webMenuType = value;
      this.setWebMenuHeight();
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(url => {
      this.onChangeWebMenuType(0);
    });
  }

  ngAfterViewInit(): void {
    this.addSearchListen();
  }

  // 添加search监听
  private addSearchListen() {
    if (this.searchContent) {
      let timer: number;
      fromEvent(this.searchContent.nativeElement, 'focus').subscribe(data => {
        const target = data.target as HTMLInputElement;
        if (target.value !== '') this.searchTip?.show('click', target);
      });
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
          return this.searchTip?.hide();
        } else {
          this.searchTip?.show('click', target);
          this.searchTipWidth = target.clientWidth;
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
    zip([
      this.netService.getSearchContent$('nft', value),
      this.netService.getSearchContent$('collection', value),
      this.netService.getSearchContent$('user', value),
    ]).subscribe(([nft, collection, user]) => {
      this.searchResult.loading = false;
      if (!this.searchTip?.render) return;
      this.searchResult.nft = [];
      this.searchResult.collection = [];
      this.searchResult.user = [];
      if (nft.code === 200 && nft.data && nft.data.length) {
        this.searchResult.nft = nft.data.map((item: any) => {
          return {
            id: item.NftID,
            logo: item.Image||'assets/images/logo/default-avatar@2x.png',
            name: item.Name,
            describe: item.Description,
          };
        });
      }
      if (collection.code === 200 && collection.data && collection.data.length) {
        this.searchResult.collection = collection.data.map((item: any) => {
          return {
            id: item.CollectionID,
            logo: item.Image||'assets/images/logo/default-avatar@2x.png',
            name: item.Name,
            describe: item.Description,
          };
        });
      }
      if (user.code === 200 && user.data && user.data.length) {
        this.searchResult.user = user.data.map((item: any) => {
          return {
            id: item.Address,
            logo: item.Avator||'assets/images/logo/default-avatar@2x.png',
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

  initMenu() {
    this.items = [
      {
        label: $localize`探索`,
        items: [
          this.exploreList.map<MenuItem>(
            item => ({
              items: [
                {
                  label: item.title,
                  command: () => {
                    if (item.key) {
                      this.router.navigate(['explore'],{queryParams:{id: item.key}});
                    } else {
                      this.router.navigate(['nft']);
                    }
                  }
                }
              ]
            })
          )
        ]
      },
      {
        label: $localize`排行榜`,
        command: () => {
          this.router.navigate(['ranking-list']);
        }
      },
      {
        label: $localize`创造NFT`,
        command: () => {
          this.router.navigate(['create', 'nft']);
        }
      },
      {
        icon: 'pi pi-globe',
        items: [
          [
            { items: [{
              label: $localize`English`,
              command: () => {
                window.location.href = window.location.origin + '/en-US';
              }
            }] },
            { items: [{
              label: $localize`简体中文`,
              command: () => {
                window.location.href = window.location.origin + '/zh-Hans';
              }
            }] },
          ]
        ]
      },
    ];
  }
  goLink(type:string) {
    if (type == '1') {
      this.router.navigate(['ranking-list']);
    } else {
      this.router.navigate(['create', 'nft']);
    }
    this.webMenuType = 0
  }
  /**
   * 判断是否已经登录
   **/
  private async checkLoginType() {
    await ToolFuncTimeSleep(1);
    ToolFuncLinkWallet(this.netService.signLogin$.bind(this.netService), true).subscribe(data => {
      if (data?.isLinked) this.netService.getNowUserInfo$().subscribe(({code}) => {
        if (code === 200) this.stateService.linkedWallet$.next(data);
        else this.stateService.linkedWallet$.next({...accountStoreInit, isLinking: false});
      });
      else this.stateService.linkedWallet$.next({...accountStoreInit, isLinking: false});
    });
  }

  /**
   * 监听账户信息
  **/
  private listenWalletInfo() {
    this.stateService.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
      this.hadAccount = data.isLinked;
    });
  }

  /**
   * 关联钱包方法
  **/
  async onLinkWallet() {
    this.stateService.globalLoadingSwitch(true);
    // this指向修改
    ToolFuncLinkWallet(this.netService.signLogin$.bind(this.netService)).subscribe(data => {
      if (data?.isLinking === false) {
        this.stateService.globalLoadingSwitch(false);
      }
      if (data?.isLinked === false) {
        if (data.accountType) {
          this.BaseMessage.warn($localize`不支持PRC10地址`);
        } else {
          this.BaseMessage.warn($localize`获取账户失败`);
        }
        return;
      }
      if (data) this.stateService.linkedWallet$.next(data);
    });
  }

  /**
   * 展示个人菜单栏
   **/
  onSwitchUserMenu() {
    this.stateService.userMenuState$.next(
      !this.stateService.userMenuState$.value
    );
  }

  /**
   * 修改web侧边栏状态
   **/
  onChangeWebMenuType(index: number) {
    this.webMenuType$.next(index);
  }

  // 侧边栏高度调整
  async setWebMenuHeight() {
    await ToolFuncTimeSleep(0.1);
    const headerHeight = this.headerContent?.nativeElement.clientHeight || 0;
    const bodyHeight = document.body.clientHeight;
    // 获取body滚动距离
    const bodyScroll = document.body.scrollTop;
    if (this.menuContent) {
      this.menuContent.nativeElement.style.height = (
        bodyHeight - headerHeight + bodyScroll
      ) + 'px';
      this.menuContent.nativeElement.style.top = (headerHeight - bodyScroll) + 'px';
    }
  }

  /**
   * 监听搜索框
   **/
  onListenSearchInput(event: Event) {
    if (!event.target) return;
    const inputTarget = event.target as HTMLInputElement;
    console.log(inputTarget.value);
  }
  menuTab(item:any) {
    if (item.key) {
      this.router.navigate(['explore'],{queryParams:{id: item.key}});
    } else {
      this.router.navigate(['nft']);
    }
  }

}
