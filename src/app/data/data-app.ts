export interface InDataApp {
  language: string;
}

export class DataApp implements InDataApp {
  // 语言
  /** zh-Hans | en-US */
  language: string = 'en-US';
  #languageList: string[] = ['zh-Hans', 'en-US'];
  // 初始化语言
  #initLanguage() {
    const browserLanguage = window.location.pathname.split('/')[1];
    for (let i = 0; i < this.#languageList.length; i++) {
      if (browserLanguage === this.#languageList[i]) {
        this.language = this.#languageList[i];
        break;
      }
    }
  }

  constructor() {
    this.#initLanguage();
  }
}
