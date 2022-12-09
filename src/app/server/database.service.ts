import { DataApp, InDataApp } from './../data/data-app';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TypeSubUserInfo = {
  avatar?: string;
  mainBg?: string;
  name?: string;
  describe?: string;
  balance?: string;
  balanceDollar?: string;
  link?: {
    [key: string]: string;
  };
} | null;

/**
 * 持久公用状态池
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  /** 应用数据 */
  get appData$ (): BehaviorSubject<InDataApp> { return this.#appData; }
  #appData = new BehaviorSubject<InDataApp>(new DataApp());
  /** 设置应用数据 */
  public setAppData (data: Partial<DataApp>) {
    this.#appData.next({
      ...this.#appData.value, ...data
    });
  }

  /**
   * 用户信息
   **/
  get nowUserInfo$ (): Observable<TypeSubUserInfo> {
    return this.#nowUserInfo$.pipe();
  }
  set nowUserInfo (data: Partial<TypeSubUserInfo>) {
    if (data === null) {
      this.#nowUserInfo$.next(null);
    } else {
      this.#nowUserInfo$.next({
        ...this.#nowUserInfo$.value, ...data
      });
    }
  }
  #nowUserInfo$ =  new BehaviorSubject<TypeSubUserInfo>({
    avatar: '../../assets/images/logo/default-avatar@2x.png',
  });
  constructor() { }
}


export const nftTypesArr: {
  title: string;
  key: string;
}[] = [
  {
    title: $localize`热门`,
    key: '热门',
  },
  {
    title: $localize`艺术`,
    key: '艺术',
  },
  {
    title: $localize`收藏品`,
    key: '收藏品',
  },
  {
    title: $localize`虚拟世界`,
    key: '虚拟世界',
  },
  {
    title: $localize`音乐`,
    key: '音乐',
  },
  {
    title: $localize`实用`,
    key: '实用',
  },
  {
    title: $localize`体育`,
    key: '体育',
  },
  {
    title: $localize`域名`,
    key: '域名',
  }
];
