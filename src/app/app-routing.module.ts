import { MySettingComponent } from './page/my-setting/my-setting.component';
import { MyNftComponent } from './page/my-nft/my-nft.component';
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

import { ComponentsModule } from './components/components.module';

import { ExploreItemComponent } from './page/explore/item/item.component';
import { HomeComponent } from './page/home/home.component';
import { ExploreComponent } from './page/explore/explore.component';
import { AllNftComponent } from './page/allNft/allNft.component';
import { AuctionComponent } from './page/auction/auction.component';
import { RankingListComponent } from './page/ranking-list/ranking-list.component';
import { CreateCollectionComponent } from './page/create-collection/create-collection.component';

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
  // 创造收藏品
  {
    component: CreateNftComponent,
    path: 'create/nft',
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
    component: MyNftComponent,
    path: 'my/nft',
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
  {
    component: HomeComponent,
    path: '**',
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ExploreItemComponent,
    ExploreComponent,
    AllNftComponent,
    AuctionComponent,
    RankingListComponent,
    CreateCollectionComponent,
    CreateNftComponent,
    ShowNftComponent,
    SellNftComponent,
    MyNftComponent,
    MySettingComponent,
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
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {
}
