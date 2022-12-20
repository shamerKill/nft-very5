import { Subject, Observable } from 'rxjs';
import { NetService } from './../../server/net.service';
import { accountStoreInit } from './../../server/state.service';
import cosmo from 'cosmo-wallet-tool';
import { environment } from 'src/environments/environment';

// 需要的权限类型
const needPermission = [
	'accountAddress', 'accountAddressType', 'contractCall', 'tokenTransferSend', 'contractSend', 'liquidity', 'sign'
];

/**
 * 判断钱包类型
**/
export const ToolFuncCheckWalletType = async (): Promise<'wallet'|'web'|null> => {
	let result: 'wallet'|'web'|null = null;
	if (await cosmo.isChrome) result = 'web';
	else if (await cosmo.isWallet) result = 'wallet';
	return result;
};

/**
 * 链接钱包
**/
export const ToolFuncLinkWallet = (login$: NetService['signLogin$'], init: boolean = false): Observable<typeof accountStoreInit | null> => {
  const loginSub = new Subject<typeof accountStoreInit | null>();
  // 链接中
  loginSub.next({...accountStoreInit});
	let deviceType: 'wallet'|'web'|null = null;
  ToolFuncCheckWalletType().then(devType => {
    if (devType !== null) {
      deviceType = devType;
      return cosmo.getPermission();
    }
    else return Promise.resolve(null);
  }).then(permission => {
    // 判断权限
    if (permission === null || (permission.length < needPermission.length && permission[0] !== '*')) {
      if (init) {
        // 停止链接
        loginSub.next({...accountStoreInit, isLinking: false});
        return Promise.resolve(null);
      } else {
        // 申请权限
        return cosmo.applyPermission();
      }
    } else {
      return Promise.resolve(true);
    }
  }).then(permission => {
    // 获取用户信息
    if (permission) {
      return Promise.all([
        cosmo.getAccountType(),
        cosmo.getAccount()
      ]);
    } else {
      // 拒绝权限停止链接
      loginSub.next({...accountStoreInit, isLinking: false});
      return Promise.resolve(null);
    }
  }).then(async info => {
    if (!info) return;
    if (init) {
      const [ accountType, accountAddress ] = info;
      loginSub.next({
        isLinked: true,
        isLinking: false,
        isWallet: deviceType === 'wallet',
        isWeb: deviceType === 'web',
        accountAddress: accountAddress??'',
        accountType: accountType === 'PRC20' ? 'PRC20' : 'PRC10'
      });
      return;
    }
    // 进行签名
    let sign: string | undefined;
    if (deviceType === 'web') {
      const output = await cosmo.chromeTool.dataSignStr(environment.signStr);
      if (output) sign = (output as any).signed;
    } else if (deviceType === 'wallet') {
      const output = await cosmo.walletTool.sign(environment.signStr);
      if (output?.data) sign = output.data;
    }
    // 利用sign登录
    if (sign) {
      const login: any = await new Promise(resolve => {
        login$(environment.signStr, sign!).subscribe(resolve);
      });
      if (login.code !== 200) sign = undefined;
    }
    if (info && info[0] && info[1] && sign) {
      const [ accountType, accountAddress ] = info;
      loginSub.next({
        isLinked: true,
        isLinking: false,
        isWallet: deviceType === 'wallet',
        isWeb: deviceType === 'web',
        accountAddress: accountAddress,
        accountType: accountType === 'PRC20' ? 'PRC20' : 'PRC10'
      });
    } else {
      loginSub.next({...accountStoreInit, isLinking: false});
    }
  });
  return loginSub.pipe();
}


// 用户签名
export const ToolFuncWalletSign = (data: string) => {
  const subSign = new Subject<string|null>();
  ToolFuncCheckWalletType().then(async deviceType => {
    // 进行签名
    let sign: string | null = null;
    if (deviceType === 'web') {
      const output = await cosmo.chromeTool.dataSignStr(data);
      if (output) sign = (output as any).signed;
    } else if (deviceType === 'wallet') {
      const output = await cosmo.walletTool.sign(data);
      if (output?.data) sign = output.data;
    }
    subSign.next(sign);
  })
  return subSign.pipe();
}
