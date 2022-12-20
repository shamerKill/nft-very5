import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

/**
 * 对基本提示进行封装
 **/
@Injectable({
  providedIn: 'root'
})
export class BaseMessageService {

  constructor(
    private message: MessageService,
  ) { }

  warn(message: string) {
    this.message.add({
      severity: 'warn',
      summary: $localize`提示`,
      detail: message,
    });
  }

  success(message: string) {
    this.message.add({
      severity: 'success',
      summary: $localize`提示`,
      detail: message,
    });
  }

  info(message: string) {
    this.message.add({
      severity: 'info',
      summary: $localize`提示`,
      detail: message,
    });
  }
}
