import { ToolFuncNumberDiv } from 'src/app/tools/functions/number';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigNum'
})
export class BigNumPipe implements PipeTransform {

  transform(num: string|number, digits = 1): string {
    const _num = BigInt(num);
    const lookup = [
      { value: BigInt(1), symbol: "" },
      { value: BigInt(1e3), symbol: "K" },
      { value: BigInt(1e6), symbol: "M" },
      { value: BigInt(1e9), symbol: "G" },
      { value: BigInt(1e12), symbol: "T" },
      { value: BigInt(1e15), symbol: "P" },
      { value: BigInt(1e18), symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup.slice().reverse().find((item) => {
      return _num >= item.value
    });
    return item ? ToolFuncNumberDiv(_num.toString(), item?.value.toString()??'1', { places: digits }).replace(rx, "$1") + item?.symbol : "0";
  }

}
