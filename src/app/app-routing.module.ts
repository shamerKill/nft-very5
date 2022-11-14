import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from './components/components.module';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { ExploreComponent } from './page/explore/explore.component';
import { AllNftComponent } from './page/allNft/allNft.component';
import { NftItemComponent } from './page/allNft/nftItem/nftItem.component';
import { SearchComponent } from './page/search/search.component';
import { CollectionComponent } from './page/collection/collection.component';
import { UserComponent } from './page/search/user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreItemComponent } from './page/explore/item/item.component';
import { GatherItemComponent } from './page/search/item/item.component';
import { TableComponent } from './page/collection/table/table.component';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { SwiperModule } from 'swiper/angular';
import {DropdownModule} from 'primeng/dropdown';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
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
    component: SearchComponent,
    path: 'search',
  },
  {
    component: CollectionComponent,
    path: 'collection',
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
    UserComponent,
    SearchComponent,
    TableComponent,
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
    DropdownModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
    HomeComponent,
  ]
})
export class AppRoutingModule {
}
