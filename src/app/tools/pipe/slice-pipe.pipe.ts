import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'centerSlice'
})
export class SlicePipePipe implements PipeTransform {

  transform(input?: string, startLen = 8, endLen = 8): unknown {
    if (input === undefined) return '';
    if (input.length < (startLen + endLen)) return input;
    const result: string = input.substring(0, startLen) + '...' + input.substring(input.length - endLen);
    return result;
  }

}
