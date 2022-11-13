import { Component, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

// 自动处理流挂载
// 使用： rx.pipe(this.$pipeSwitch()).subscribe();
@Component({
  template: ''
})
export class ToolClassAutoClosePipe implements OnDestroy {
  private $pipeSwitchVar: Subject<boolean> = new Subject();
  constructor() {}
  ngOnDestroy(): void {
    this.$pipeSwitchVar.next(true);
    this.$pipeSwitchVar.unsubscribe();
  }
  protected $pipeSwitch<T>() {
    return takeUntil<T>(this.$pipeSwitchVar);
  }
}
