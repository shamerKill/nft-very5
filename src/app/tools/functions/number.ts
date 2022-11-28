/**
 * 计算涨跌幅
 **/
export const ToolFuncGetChg = (before: string, now: string) => {
  const beforeNum = parseFloat(before) || 0;
  const nowNum = parseFloat(now) || 0;
  const chgNum = (nowNum - beforeNum) / beforeNum || 0;
  const perStr = ToolFuncNumberToPercentage(chgNum.toFixed(4));
  return {
    str: perStr,
    dir: chgNum >= 0,
  }
}


/**
 * 除法
 **/
export function ToolFuncNumberDiv (divisor: string, dividend: string, options?: { places?: number}): string;
export function ToolFuncNumberDiv (divisor: number, dividend: number, options?: { places?: number}): number;
export function ToolFuncNumberDiv (divisor: BigInt, dividend: BigInt, options?: { places?: number}): BigInt;
export function ToolFuncNumberDiv <T=string|number|BigInt>(
	// 除数
	divisor: T,
	// 被除数
	dividend: T,
	options?: {
		// 结果小数点精度
		places?: number,
	}
): T {
	let divisorStr = '';
	let dividendStr = '';
	if (typeof divisor === 'string') {
		divisorStr = divisor;
		dividendStr = dividend as unknown as string;
	} else if (typeof divisor === 'number') {
		divisorStr = divisor.toString();
		dividendStr = (dividend as unknown as number).toString();
	} else {
		divisorStr = (divisor as unknown as BigInt).toString();
		dividendStr = (dividend as unknown as BigInt).toString();
	}
	// 获取最长的小数点
	const divisorStrMax = ToolFuncNumberGetDecimalLength(divisorStr);
	const dividendStrMax = ToolFuncNumberGetDecimalLength(dividendStr);
	let maxPointLen = divisorStrMax;
	if (divisorStrMax < dividendStrMax) maxPointLen = dividendStrMax;
	// 转换成无小数点的字符串
	const divisorStrInt = ToolFuncNumberStrToIntForFloat(divisorStr, maxPointLen);
	const dividendStrInt = ToolFuncNumberStrToIntForFloat(dividendStr, maxPointLen);
	let result = (parseInt(divisorStrInt) / parseInt(dividendStrInt)).toFixed(options?.places ??maxPointLen);
	if (parseFloat(divisorStr) === 0) result = '0';
	if (typeof divisor === 'string') {
		return result as unknown as T;
	} else if (typeof divisor === 'number') {
		return parseFloat(result) as unknown as T;
	} else {
		return BigInt(result) as unknown as T;
	}
}
/**
 * 乘法
**/
export const ToolFuncNumberMul = (first: string, second: string): string => {
	// 获取最长的小数点
	const firstMax = ToolFuncNumberGetDecimalLength(first);
	const secondMax = ToolFuncNumberGetDecimalLength(second);
	let maxPointLen = firstMax;
	if (firstMax < secondMax) maxPointLen = secondMax;
	const firstInt = ToolFuncNumberStrToIntForFloat(first, maxPointLen);
	const secondInt = ToolFuncNumberStrToIntForFloat(second, maxPointLen);
	const resultBig = BigInt(firstInt) * BigInt(secondInt);
	const result = ToolFuncNumberStrToFloatForInt(resultBig.toString(), maxPointLen * 2);
	return result;
};

/**
 * 加法
**/
export const ToolFuncNumberAdd = (first: string, second: string): string => {
	// 获取最长的小数点
	const firstMax = ToolFuncNumberGetDecimalLength(first);
	const secondMax = ToolFuncNumberGetDecimalLength(second);
	let maxPointLen = firstMax;
	if (firstMax < secondMax) maxPointLen = secondMax;
	const firstInt = ToolFuncNumberStrToIntForFloat(first, maxPointLen);
	const secondInt = ToolFuncNumberStrToIntForFloat(second, maxPointLen);
	const resultBig = BigInt(firstInt) + BigInt(secondInt);
	const result = ToolFuncNumberStrToFloatForInt(resultBig.toString(), maxPointLen);
	return result;
};
/**
 * 减法
**/
export const ToolFuncNumberCut = (first: string, second: string): string => {
	// 获取最长的小数点
	const firstMax = ToolFuncNumberGetDecimalLength(first);
	const secondMax = ToolFuncNumberGetDecimalLength(second);
	let maxPointLen = firstMax;
	if (firstMax < secondMax) maxPointLen = secondMax;
	const firstInt = ToolFuncNumberStrToIntForFloat(first, maxPointLen);
	const secondInt = ToolFuncNumberStrToIntForFloat(second, maxPointLen);
	const resultBig = BigInt(firstInt) - BigInt(secondInt);
	const result = ToolFuncNumberStrToFloatForInt(resultBig.toString(), maxPointLen);
	return result;
};

/**
 * 小数点截取
 **/
export const ToolFuncNumberSplit = (input: string, places: number, ceil: boolean =  false): string => {
	const strArr = input.split('.');
	if (strArr.length === 1) return input;
	else {
		if (places === 0) {
			if (!ceil) return strArr[0];
			else return (BigInt(strArr[0]) + BigInt(1)).toString();
		}
		strArr[1] = strArr[1].slice(0, places);
		return strArr.join('.');
	}
};

/**
 * 将小数字符串转为无小数整数
 **/
export const ToolFuncNumberStrToIntForFloat = (input: string, places: number): string => {
	const strArr = input.split('.');
	if (strArr.length === 1) strArr.push('');
	for (let i = 0; i < places; i++) {
		if (strArr[1].length < places) strArr[1] += '0';
	}
	if (strArr[1].length > places) strArr[1] = strArr[1].slice(0, places);
	let result = '';
	strArr.join('').split('').forEach(item => {
		if (result === '' && item === '0') return;
		result += item;
	});
	return result;
};

/**
 * 获取字符串小数位
 **/
export const ToolFuncNumberGetDecimalLength = (input: string): number => {
	const strArr = input.split('.');
	if (strArr.length === 1) return 0;
	else return strArr[1].length;
};

/**
 * 将整数字符串转换为带小数字符串
 **/
export const ToolFuncNumberStrToFloatForInt = (input: string, places: number): string => {
	let replaceStr = input.padStart(places + 1, '0');
	let replaceArr = replaceStr.split('').reverse();
	replaceArr.splice(places, 0, '.');
	replaceStr = replaceArr.reverse().join('');
	let resultStr = '';
	let point = false; // 是否已经判断到小数点
	for (let i = 0; i < replaceStr.length; i++) {
		if (point) {
			resultStr += replaceStr[i];
		} else if (replaceStr[i] !== '.' && replaceStr[i] !== '0') {
			resultStr += replaceStr[i];
		} else if (replaceStr[i] === '.') {
			if (resultStr === '') resultStr += '0';
			point = true;
			resultStr += replaceStr[i];
		} else if (resultStr !== '') {
			resultStr += replaceStr[i];
		}
	}
	for (let i = resultStr.length - 1; i >= 0; i--) {
		if (resultStr[i] !== '0') break;
		resultStr = resultStr.substring(0, resultStr.length - 1);
	}
	resultStr = resultStr.replace(/\.$/, '');
	return resultStr;
};

/**
 * 数字转百分比
 **/
export const ToolFuncNumberToPercentage = (input: number|string, addSign: boolean = true): string => {
	const inputStr = typeof input === 'number' ? input : parseFloat(input);
	if (Number.isNaN(inputStr)) return (addSign ? '0%' : '0');
	return parseFloat((inputStr * 1000 / 10).toFixed(2)).toString() + (addSign ? '%' : '');
}

/**
 * 百分比转数字
 **/
export const ToolFuncPercentageToNumber = (input: string): string => {
	const inputStr = input.replace(/%$/, '');
	return (parseFloat(inputStr) / 100).toString();
}

/**
 * 处理小数精度
 **/
export const ToolFuncNonExponential = (num:any) => {
	num = Number(num);
	let m:any = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
	return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}
