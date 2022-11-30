import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

export type TypeFileEvent = {
  error: 'size'|'type'|null,
  data: string|null,
};

@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.scss']
})
export class ChooseFileComponent implements OnInit {

  @ViewChild('input')
  inputBox?: ElementRef<HTMLInputElement>;

  @Input('styleClass')
  class?: string;

  @Input()
  label: string = Math.random().toFixed(10).replace('.', '');

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
   * 选择
   **/
  onChoose () {
    this.inputBox?.nativeElement.click();
  }

  /**
   * 获取文件
   **/
  async onChange(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];
    if (!file) return;
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

}
