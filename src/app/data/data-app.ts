export interface InDataApp {
  language: string;
}

export class DataApp implements InDataApp {
  // 语言
  /** zh-CN | en-US */
  language: string = 'en-US';
  #languageList: string[] = ['zh-CN', 'en-US'];
  // 初始化语言
  #initLanguage() {
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage[0] === 'zh') {
      this.language = this.#languageList[0];
    } else {
      this.language = this.#languageList[1];
    }
  }

  constructor() {
    this.#initLanguage();
  }
}
