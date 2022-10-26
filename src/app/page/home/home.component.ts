import { DatabaseService } from './../../server/database.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public dataBase: DatabaseService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  onTabChange(url:string) {
    this.router.navigateByUrl(url);
  }
}
