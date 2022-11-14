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
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BaseBoxComponent,
    FilterBoxComponent,
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
    InputNumberModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BaseBoxComponent,
    FilterBoxComponent,
  ]
})
export class ComponentsModule {
}
