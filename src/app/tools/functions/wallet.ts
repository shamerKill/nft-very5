import { NetService } from './../../server/net.service';
import { accountStoreInit } from './../../server/state.service';
import cosmo from 'cosmo-wallet-tool';
import { environment } from 'src/environments/environment';

// 需要的权限类型
const needPermission = [
	'accountAddress', 'accountAddressType', 'contractCall', 'tokenTransferSend', 'contractSend', 'liquidity'
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
export const ToolFuncLinkWallet = async (login$: NetService['signLogin$'], init: boolean = false): Promise<typeof accountStoreInit | null> => {
	const deviceType = await ToolFuncCheckWalletType();
	if (deviceType === null) return null;
	// 判断权限
	const permission = await cosmo.getPermission();
	if (permission === null || (permission.length < needPermission.length && permission[0] !== '*')) {
		if (init) return null;
		// 申请权限
		const permissionResult = await cosmo.applyPermission();
		if (permissionResult === null) return null;
	}
	const accountType = await cosmo.getAccountType();
	const accountAddress = await cosmo.getAccount();
  // 进行签名
  let sign: string | undefined;
  if (deviceType === 'web') {
    const output = await cosmo.chromeTool.dataSignStr(environment.signStr);
    if (output) sign = (output as any).signed;
  } else if (deviceType === 'wallet') {
    const output = await cosmo.walletTool.sign(environment.signStr);
    if (output?.status === 200) sign = output.data;
  }
  // 利用sign登录
  if (sign) {
    const login: any = await new Promise(resolve => {
      login$(environment.signStr, sign!).subscribe(resolve);
    });
    if (login.code !== 200) sign = undefined;
  }
	if (!accountAddress) return null;
	if (!accountType) return null;
  if (!sign) return null;
	return {
    isLinked: true,
		isWallet: deviceType === 'wallet',
		isWeb: deviceType === 'web',
		accountAddress: accountAddress,
		accountType: accountType === 'PRC20' ? 'PRC20' : 'PRC10'
	};
}
