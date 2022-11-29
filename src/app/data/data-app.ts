export interface InDataApp {
  language: string;
  languageToFormat: () => string;
  languageListToFormat: () => (string[]);
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

  public languageToFormat(input?: string) {
    let language = this.language;
    if (input) language = input;
    switch (language) {
      case this.#languageList[0]:
        return '中文';
      default:
        return 'English';
    }
  }


  public languageListToFormat(): string[] {
    return this.#languageList.map<string>(item => this.languageToFormat(item));
  }
}
