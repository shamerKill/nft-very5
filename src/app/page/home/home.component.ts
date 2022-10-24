import { DatabaseService } from './../../server/database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public dataBase: DatabaseService,
  ) {
  }

  ngOnInit(): void {
  }

}
