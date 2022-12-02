import { SlicePipePipe } from './slice-pipe.pipe';
import { BigNumPipe } from './big-num.pipe';
import { NgModule } from '@angular/core';



@NgModule({
  declarations: [
    BigNumPipe,
    SlicePipePipe,
  ],
  exports: [
    BigNumPipe,
    SlicePipePipe,
  ]
})
export class PipeModule { }
