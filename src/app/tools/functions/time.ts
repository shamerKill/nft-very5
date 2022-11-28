export type TypeToolFuncDownTime<T = number> = {
  day: T;
  hour: T;
  minute: T;
  second: T;
};
export function ToolFuncFormatTime (inputMillisecond: number): TypeToolFuncDownTime {
  let canUseTime = inputMillisecond;
  const aSecond = 1000;
  const aMinute = aSecond * 60;
  const aHour = aMinute * 60;
  const aDay = aHour * 24;
  const day = Math.floor(canUseTime / aDay);
  canUseTime -= day * aDay;
  const hour = Math.floor(canUseTime / aHour);
  canUseTime -= hour * aHour;
  const minute = Math.floor(canUseTime / aMinute);
  canUseTime -= minute * aMinute;
  const second = Math.floor(canUseTime / aSecond);
  return { day, hour, minute, second };
}
export function ToolFuncFormatTimeStr(inputMillisecond: number): TypeToolFuncDownTime<string> {
  const result = ToolFuncFormatTime(inputMillisecond);
  return {
    day: ToolFuncNumAddZero(result.day),
    hour: ToolFuncNumAddZero(result.hour),
    minute: ToolFuncNumAddZero(result.minute),
    second: ToolFuncNumAddZero(result.second)
  };
}
export function ToolFuncNumAddZero(input: number, length = 2): string {
  let outArr = input.toString().split('');
  for (let i = 0; i < length - outArr.length; i++) {
    outArr.unshift('0');
  }
  return outArr.join('');
}
export function ToolFuncTimeToFormatBig(input: TypeToolFuncDownTime<number>): string {
  if (input.day !== 0) return input.day + $localize`天`;
  if (input.hour !== 0) return input.hour + $localize`时`;
  if (input.minute !== 0) return input.minute + $localize`分`;
  if (input.second !== 0) return input.minute + $localize`秒`;
  return '';
}


/**
 * 睡眠函数
 * @param time 秒数
**/
export const ToolFuncTimeSleep = (time: number) => {
  const sleepTime = Math.floor(time * 1000) || 0;
  return new Promise<void>(resolve => setTimeout(resolve, sleepTime));
}
