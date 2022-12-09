import { BaseMessageService } from './server/base-message.service';
import { ToastModule } from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { StateService } from './server/state.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NetService } from './server/net.service';
import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatabaseService } from './server/database.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ComponentsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [DatabaseService, NetService, StateService, BaseMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
