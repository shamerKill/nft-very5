import { BaseMessageService } from './server/base-message.service';
import { ToolClassAutoClosePipe } from './tools/classes/pipe-close';
import { ClipboardService } from 'ngx-clipboard';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent extends ToolClassAutoClosePipe implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private clipboard: ClipboardService,
    private BaseMessage: BaseMessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.listenClipboard();
  }

  // 监听复制弹窗
  private listenClipboard() {
    this.clipboard.copyResponse$.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data.isSuccess) {
        this.BaseMessage.success($localize`复制成功`);
      } else {
        this.BaseMessage.warn($localize`复制失败`);
      }
    });
  }
}
