import { SlicePipePipe } from '../tools/pipe/slice-pipe.pipe';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { FilterBoxComponent } from './filter-box/filter-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BaseBoxComponent } from './base-box/base-box.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {MegaMenuModule} from 'primeng/megamenu';
import {AvatarModule} from 'primeng/avatar';
import { PageBgBoxComponent } from './page-bg-box/page-bg-box.component';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ClipboardModule } from 'ngx-clipboard';
import { LoadingComponent } from './loading/loading.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BaseBoxComponent,
    FilterBoxComponent,
    PageBgBoxComponent,
    UserMenuComponent,
    SlicePipePipe,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    MegaMenuModule,
    AvatarModule,
    AccordionModule,
    DropdownModule,
    InputNumberModule,
    ToastModule,
    ClipboardModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BaseBoxComponent,
    FilterBoxComponent,
    PageBgBoxComponent,
    UserMenuComponent,
    LoadingComponent,
  ]
})
export class ComponentsModule {
}
