import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}
  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
