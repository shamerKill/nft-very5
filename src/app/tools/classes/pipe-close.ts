import { Component, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

/**
 * 自动处理流卸载
**/
@Component({
  template: ''
})
export class ToolClassAutoClosePipe implements OnDestroy {
  private pipeSwitchVar$: Subject<boolean> = new Subject();
  constructor() {}
  ngOnDestroy(): void {
    this.pipeSwitchVar$.next(true);
    this.pipeSwitchVar$.unsubscribe();
  }
  /**
   * 使用： rx.pipe(this.pipeSwitch$()).subscribe();
  **/
  protected pipeSwitch$<T>() {
    return takeUntil<T>(this.pipeSwitchVar$);
  }
}
