import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { ExploreComponent } from './page/explore/explore.component';
import { AllNftComponent } from './page/allNft/allNft.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreItemComponent } from './page/explore/item/item.component';
import { AccordionModule } from 'primeng/accordion';
import { FilterBoxComponent } from './components/filter-box/filter-box.component';

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
    FilterBoxComponent,
    ExploreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    ButtonModule,
    AccordionModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
