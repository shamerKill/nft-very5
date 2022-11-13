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
