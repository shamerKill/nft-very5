import { NgModule } from '@angular/core';

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
  ],
  providers: [DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
