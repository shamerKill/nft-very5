import { TypeFileEvent } from './../choose-file/choose-file.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drag-box',
  templateUrl: './drag-box.component.html',
  styleUrls: ['./drag-box.component.scss']
})
export class DragBoxComponent implements OnInit {

  @Input('styleClass')
  class?: string;

  /**
   * 单位KB
   **/
  @Input('max-size')
  maxSize: number = 1024;

  /**
   * 正则
   * 默认图片
   **/
  @Input('file-type')
  fileType: string = 'image/*';

  /**
   * 获取图片base64信息
   **/
  @Output()
  onDrop = new EventEmitter<TypeFileEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * 拖动方法
   **/
  async onDropHandle(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    const file = event.dataTransfer.files[0];
    if (!file) return;
    // 判断图片
    if (!(new RegExp(this.fileType)).test(file.type)) {
      this.onDrop.emit({
        error: 'type',
        data: null,
      });
      return;
    }
    // 判断尺寸
    if (file.size > this.maxSize * 1024) {
      this.onDrop.emit({
        error: 'size',
        data: null,
      });
      return;
    }
    // 获取文件
    let fileBase64 = `data:${file.type};base64,`;
    let charStr = '';
    const reader = file.stream().getReader();
    let readDone = false;
    while (!readDone) {
      const {done, value} = await reader.read();
      if (value) {
        const chunk = 8 * 1024;
        for (let i = 0; i < value.length / chunk; i++) {
          charStr += String.fromCharCode(...value.slice(i * chunk, (i + 1) * chunk));
        }
      }
      if (done) readDone = true;
    }
    fileBase64 += btoa(charStr);
    this.onDrop.emit({
      error: null,
      data: fileBase64,
    });
  }

  /**
   * 拖动结束方法
   **/
   onDropOverHandle(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * 读取粘贴板方法
   **/
  onPaste(event: ClipboardEvent) {
    if (event.clipboardData && event.clipboardData.items.length) {
      const items = event.clipboardData.items;
      if (items.length) {
        for (let i = 0; i < items.length; i++) {
          const element = items[i];
          console.log(element.type);
          if (element.type.match('image')) {
            this.getFileBase64(element).then(dropFile => {
              if (dropFile) {
                this.onDrop.emit({
                  error: null,
                  data: dropFile,
                });
              }
            });
            break;
          }
        }
      }
    }
  }

  private async getFileBase64(input: DataTransferItem): Promise<string|undefined> {
    const file = input.getAsFile();
    if (!file) return;
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          const buf = new Uint8Array(reader.result);
          let baseResult = '';
          for (let i = 0; i < buf.length; i++) {
            baseResult += String.fromCharCode(buf[i]);
          }
          const base = `data:${file.type};base64,` + window.btoa(baseResult);
          resolve(base);
        } else {
          return;
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

}
