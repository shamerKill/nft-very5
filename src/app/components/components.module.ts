import { PipeModule } from './../tools/pipe/pipe.module';

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
import { DragBoxComponent } from './drag-box/drag-box.component';
import { ChooseFileComponent } from './choose-file/choose-file.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BaseBoxComponent,
    FilterBoxComponent,
    PageBgBoxComponent,
    UserMenuComponent,
    LoadingComponent,
    DragBoxComponent,
    ChooseFileComponent,
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
    PipeModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BaseBoxComponent,
    FilterBoxComponent,
    PageBgBoxComponent,
    UserMenuComponent,
    LoadingComponent,
    DragBoxComponent,
    ChooseFileComponent,
  ]
})
export class ComponentsModule {
}
