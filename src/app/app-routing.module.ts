import { PipeModule } from './tools/pipe/pipe.module';
import { MessageService } from 'primeng/api';
import { MySettingComponent } from './page/my-setting/my-setting.component';
import { MyStarComponent } from './page/my-star/my-star.component';
import { SellNftComponent } from './page/sell-nft/sell-nft.component';
import { ShowNftComponent } from './page/show-nft/show-nft.component';
import { FormsModule } from '@angular/forms';
import { CreateNftComponent } from './page/create-nft/create-nft.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { SwiperModule } from 'swiper/angular';
import {TableModule} from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {MultiSelectModule} from 'primeng/multiselect';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {TooltipModule} from 'primeng/tooltip';
import {InputSwitchModule} from 'primeng/inputswitch';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService} from 'primeng/api';
import {MenuModule} from 'primeng/menu';
import {DialogModule} from 'primeng/dialog';


import { ComponentsModule } from './components/components.module';
import { AuctionComponent } from './page/auction/auction.component';
import { RankingListComponent } from './page/ranking-list/ranking-list.component';
import { CreateCollectionComponent } from './page/create-collection/create-collection.component';
import { HomeComponent } from './page/home/home.component';
import { ExploreComponent } from './page/explore/explore.component';
import { AllNftComponent } from './page/allNft/allNft.component';
import { NftItemComponent } from './page/allNft/nftItem/nftItem.component';
import { SearchComponent } from './page/search/search.component';
import { UserDetailComponent } from './page/userDetail/userDetail.component';
import { CollectionComponent } from './page/collection/collection.component';

import { UserComponent } from './page/search/user/user.component';
import { ExploreItemComponent } from './page/explore/item/item.component';
import { GatherItemComponent } from './page/search/item/item.component';
import { TableComponent } from './page/collection/table/table.component';

const routes: Routes = [
  { // 首页
    component: HomeComponent,
    path: '',
  },
  { // 拍卖
    component: AuctionComponent,
    path: 'auction/:id',
  },
  { // 排行榜
    component: RankingListComponent,
    path: 'ranking-list',
  },
  // 创建新合集
  {
    component: CreateCollectionComponent,
    path: 'create/collection',
  },
  // 修改合集
  {
    component: CreateCollectionComponent,
    path: 'edit/collection/:id',
  },
  // 创造收藏品
  {
    component: CreateNftComponent,
    path: 'create/nft',
  },
  // 修改收藏品
  {
    component: CreateNftComponent,
    path: 'edit/nft/:id',
  },
  // nft展示
  {
    component: ShowNftComponent,
    path: 'show/nft/:id',
  },
  // nft出售
  {
    component: SellNftComponent,
    path: 'sell/nft/:id',
  },
  // 我的关注/收藏
  {
    component: MyStarComponent,
    path: 'my/star',
  },
  // 我的设置
  {
    component: MySettingComponent,
    path: 'my/setting',
  },
  {
    component: ExploreComponent,
    path: 'explore',
  },
  {
    component: AllNftComponent,
    path: 'nft',
  },
  // {
  //   component: SearchComponent,
  //   path: 'search',
  // },
  {
    component: CollectionComponent,
    path: 'collection',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    component: UserDetailComponent,
    path: 'user',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    component: HomeComponent,
    path: '**',
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ExploreItemComponent,
    GatherItemComponent,
    NftItemComponent,
    ExploreComponent,
    AllNftComponent,
    AuctionComponent,
    RankingListComponent,
    CreateCollectionComponent,
    CreateNftComponent,
    ShowNftComponent,
    SellNftComponent,
    MyStarComponent,
    MySettingComponent,
    UserComponent,
    SearchComponent,
    TableComponent,
    UserDetailComponent,
    CollectionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    ComponentsModule,
    CommonModule,
    CardModule,
    TabViewModule,
    SwiperModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    InputSwitchModule,
    TooltipModule,
    DropdownModule,
    ToastModule,
    MenuModule,
    PipeModule,
    DialogModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
  ]
})
export class AppRoutingModule {
}
