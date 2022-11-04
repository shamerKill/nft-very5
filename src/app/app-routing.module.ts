import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from './components/components.module';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { ExploreComponent } from './page/explore/explore.component';
import { AllNftComponent } from './page/allNft/allNft.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreItemComponent } from './page/explore/item/item.component';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { SwiperModule } from 'swiper/angular';

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
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
    HomeComponent,
  ]
})
export class AppRoutingModule {
}
