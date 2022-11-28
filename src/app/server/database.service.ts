import { DataApp, InDataApp } from './../data/data-app';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * 持久公用状态池
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  /** 应用数据 */
  get appData (): BehaviorSubject<InDataApp> { return this.#appData; }
  #appData = new BehaviorSubject<InDataApp>(new DataApp());
  /** 设置应用数据 */
  public setAppData (data: Partial<DataApp>) {
    this.#appData.next({
      ...this.#appData.value, ...data
    });
  }

  constructor() { }
}
