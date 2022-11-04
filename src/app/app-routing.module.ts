import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from './components/components.module';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { SwiperModule } from 'swiper/angular';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
  },
  {
    component: HomeComponent,
    path: '**',
  },
];

@NgModule({
  declarations: [
    HomeComponent,
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
