import { Component, OnInit, Input } from '@angular/core';
import { StateService, accountStoreInit } from './../../../server/state.service';
import { ToolClassAutoClosePipe } from '../../../tools/classes/pipe-close';
import { NetService } from '../../../server/net.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends ToolClassAutoClosePipe implements OnInit {
  @Input() list:any[]=[]
  accountAddress: string = '';
  constructor(
    private net: NetService,
    public stateService: StateService
  ) { 
    super();
    this.stateService.linkedWallet$.pipe(this.pipeSwitch$()).subscribe(data => {
      if (data.accountAddress) this.accountAddress = data.accountAddress;
    });
  }

  ngOnInit(): void {
  }

}
