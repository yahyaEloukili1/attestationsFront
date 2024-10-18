import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GridJsModel } from '../../tables/gridjs/gridjs.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridJsService } from '../../tables/gridjs/gridjs.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  providers: [GridJsService, DecimalPipe]
})

/**
 * Starter Component
 */
export class StarterComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Table data
  gridjsList$!: Observable<GridJsModel[]>;
  total$: Observable<number>;
  griddata: any;

  constructor(private modalService: NgbModal,public service: GridJsService, private sortService: PaginationService) {
    this.gridjsList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'Grid Js', active: true }
    ];

    this.gridjsList$.subscribe((data: any) => {
      this.griddata = Object.assign([], data)
    })
  }

  // Sort Data
  onSort(column: any) {
    this.griddata= this.sortService.onSort(column, this.griddata)
  }


}
