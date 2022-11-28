import { BehaviorSubject, interval, Observable, Subscription, timer } from 'rxjs';
import { StateService } from './../../server/state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  addLoading$ = new BehaviorSubject(false);

  loadingNumArr: number[] = [];

  showLoading$ = new BehaviorSubject(false);


  constructor(
    private state: StateService,
  ) {
    this.state.globalLoading$.subscribe(data => {
      if (data > 0) {
        this.addLoading$.next(true);
      } else {
        this.showLoading$.next(false);
        timer(500).subscribe(() => this.addLoading$.next(false));
      }
    });
  }

  ngOnInit(): void {
    let timer$: Subscription[] = [];
    this.addLoading$.subscribe(type => {
      if (type) {
        // 点循环
        timer$.push(interval(200).subscribe((num) => {
          this.loadingNumArr = new Array((num % 6) + 1).fill(0);
        }));
        // 渐入
        timer$.push(timer(10).subscribe(() => this.showLoading$.next(true)));
      } else {
        timer$.forEach(item => item.unsubscribe());
      }
    });
  }

}
