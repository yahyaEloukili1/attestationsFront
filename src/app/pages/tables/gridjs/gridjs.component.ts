import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import {GridJsModel} from './gridjs.model';
import { GridJsService } from './gridjs.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gridjs',
  templateUrl: './gridjs.component.html',
  styleUrls: ['./gridjs.component.scss'],
  providers: [GridJsService, DecimalPipe]
})

/**
 * Gridjs Table Component
 */
export class GridjsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
users
  // Table data
  gridjsList$!: Observable<GridJsModel[]>;
  total$: Observable<number>;
  griddata: any;

  constructor(private modalService: NgbModal,
    private router: Router,
    public service: GridJsService, private sortService: PaginationService,private restService :restApiService) {
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
this.getReources()
  }
getReources(){
  this.restService.getResourceAll('appUsers').subscribe(data=>{
    this.users = data['_embedded'].appUsers
    console.log(this.users)

})
}
withimage(){
  this.router.navigateByUrl("pages/team")
}
addResource(){
  console.log("oeoeoeo")
  this.router.navigateByUrl("users/add")

}
onEditResource(id:any){
 

  this.router.navigateByUrl("apps/calendar/"+id)
} 
onDeleteResource(id){
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'سوف يتم الحذف بصفة نهائية!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#364574',
    cancelButtonColor: 'rgb(243, 78, 78)',
    cancelButtonText: 'إلغاء',
    customClass:{
      title: 'kuffi',
      confirmButton: 'kuffi',
      container: 'kuffi'
    },
    confirmButtonText: 'حذف'
  }).then(result => {
   
    if (result.value) {
      this.restService.deleteResourceById(this.restService.host+'/appUsers/'+id).subscribe(data=>{
        this.getReources()
         },err=>{
           console.log(err)
         })
      Swal.fire({text:'لقد تم حذف المستعمل', confirmButtonColor: '#364574',   customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }, icon: 'success',});
    }
  });
  
   
 
}

}
