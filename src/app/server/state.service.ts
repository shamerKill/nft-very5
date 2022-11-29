import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * 缓存公用状态池
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {

  /**
   * 是否已经关联钱包
  **/
  linkedWallet$ = new BehaviorSubject(accountStoreInit);

  /**
   * 手机头部菜单是否展示
  **/
  phoneMenuState$ = new BehaviorSubject(false);

  /**
   * 用户个人导航是否展示
  **/
  userMenuState$ = new BehaviorSubject(false);

  /**
   * 全局loading显示
   **/
  globalLoading$ = new BehaviorSubject(0);

  constructor() {
  }

  /**
   * 切换全局loading显示
   * @param type 显示还是隐藏loading
   **/
  globalLoadingSwitch(type: boolean) {
    if (type) this.globalLoading$.next(this.globalLoading$.getValue() + 1);
    else {
      const next = this.globalLoading$.getValue() - 1;
      this.globalLoading$.next(next <= 0 ? 0 : next);
    };
  }
}



// 判断是否已经连接账户
export const accountStoreInit: {
  isLinked: boolean;
	// 是否是app钱包
	isWallet: boolean;
	// 是否是插件钱包
	isWeb: boolean;
	// 账户地址
	accountAddress?: string;
	// 账户类型
	accountType?: 'PRC10'|'PRC20'
} = {
  isLinked: false,
	isWallet: false,
	isWeb: false,
};
