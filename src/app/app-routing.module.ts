import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { ExploreComponent } from './page/explore/explore.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
  },
  {
    component: HomeComponent,
    path: '**',
  },
  {
    component: ExploreComponent,
    path: 'explore',
  },
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    ButtonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
