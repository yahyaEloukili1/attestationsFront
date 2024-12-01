import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormGroup, FormArray, Validators, FormsModule } from '@angular/forms';
import {GridJsModel} from '../../tables/gridjs/gridjs.model';
import { GridJsService } from '../../tables/gridjs/gridjs.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  size:number = 5;
  currentPage:number = 0;
  totalPages: number;
  pages: Array<number>
  selected: boolean
  appUsers
  selectedDistrict = ""
  appRoles
  districts
  annexes
  districtSelected = false
  selectedE
  totalCount
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
   this.getResourcesCommon(this.currentPage)
    this.getDistricts()
}
onPageClicked(i:number){
  this.currentPage = i;
  if(this.districtSelected==false)
{this.getResourcesCommon(this.currentPage)
}
else{
this.onRowClickCommon(this.selectedE,this.currentPage)
}
}

getResourcesCommon(page){
  if(page==0)
  {this.currentPage = 0}
  this.rnpService.getResourceAll('appUsers').subscribe(data=>{
    let appUsers = data['_embedded'].appUsers
    if(appUsers){
    this.totalCount = appUsers.length}
    


})
this.rnpService.getResource("appUsers",page,this.size).subscribe(data=>{
  this.appUsers = data['_embedded'].appUsers
  console.log(data,'vvvvv')
 this.totalPages = data['page'].totalPages
 this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}

clickcked(){
  console.log("zzzzzzzzzzzzzz")
}
onRowClickCommon(e, page = 0) {
    this.selectedE = e;
    this.districtSelected = true;
    this.currentPage = page;
  
    if (e == 0) {
      this.getResourcesCommon(this.currentPage);
   
      
    } else {
if(e=="ADMIN")
{
  e=4
  const url = `roles2/${e}/users?page=${this.currentPage}&size=${this.size}`;
this.rnpService.getResourceAll2(url).subscribe(
  data => {
   console.log(data,"aqaqaqaqaqqaqaqqa")
    this.appUsers = data['users'];
   
    this.totalPages = Math.ceil(data['totalElements'] / this.size);
    this.pages = new Array<number>(this.totalPages);
  },
  err => {
    console.log(err);
  }
);
}else if(e=="USER-DSIT"){
  
e=5
const url = `roles2/${e}/users?page=${this.currentPage}&size=${this.size}`;
  
this.rnpService.getResourceAll2(url).subscribe(
  data => {
    console.log(data,'aaaaaaaaaaaaaaaaaaaaaaaaa')
    this.appUsers = data['users'];

    this.totalPages = Math.ceil(data['totalElements'] / this.size);
    this.pages = new Array<number>(this.totalPages);
  },
  err => {
    console.log(err);
  }
);
}else if(e=="USER-AAL"){
  e=6
  const url = `roles2/${e}/users?page=${this.currentPage}&size=${this.size}`;
  
this.rnpService.getResourceAll2(url).subscribe(
  data => {
   console.log(data,"aqaqaqaqaqqaqaqqa")
    this.appUsers = data['users'];

    this.totalPages = Math.ceil(data['totalElements'] / this.size);
    this.pages = new Array<number>(this.totalPages);
  },
  err => {
    console.log(err);
  }
);
}else{
  const url = `annexes2/${e}/users?page=${this.currentPage}&size=${this.size}`;
  
this.rnpService.getResourceAll2(url).subscribe(
  data => {
   console.log(data,"aqaqaqaqaqqaqaqqa")
    this.appUsers = data['users'];

    this.totalPages = Math.ceil(data['totalElements'] / this.size);
    this.pages = new Array<number>(this.totalPages);
  },
  err => {
    console.log(err);
  }
);
}

    }
  }
  
getDistricts(){
  this.rnpService.getResourceAll('appRoles').subscribe(data=>{
    this.appRoles = data['_embedded'].appRoles
    console.log(this.appRoles)

})
this.rnpService.getResourceAll('annexes').subscribe(data=>{
  this.annexes = data['_embedded'].annexes
  console.log(this.annexes,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")

})
}
addResource(){
    this.router.navigateByUrl("users/add")

}
onDeleteResource(p){
this.modelWarning().then(result => {
    if (result.value) {
      if(this.districtSelected==false){
        let url = p['_links'].self.href
        this.rnpService.deleteResource('appUsers',url).subscribe(data=>{
          this.getResourcesCommon(0)
          this.modelSuccess('لقد تم حذف المستعمل')
    
           },err=>{
            this.modelError('لا يمكن حدف المستعمل')
        
           })
      }else{
        
        this.rnpService.deleteResource('appUsers',`${this.rnpService.host}/appUsers/${p.id}`).subscribe(data=>{
          this.onRowClickCommon(this.selectedE)
          this.modelSuccess('لقد تم حذف المستعمل')
           },err=>{
            this.modelError('لا يمكن حدف المستعمل')
           })
      
      }
  
    
    }
  });
   
  }
  modelError(error) {
    Swal.fire({
    
      title: error,
      icon: 'error',
      confirmButtonColor: '#364574',
      confirmButtonText: 'إغلاق',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }
    });
    
  }
  modelWarning(){
    return   Swal.fire({
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
    })
  }
  modelSuccess(text) {
    Swal.fire({
      
      position: 'center',
      icon: 'success',
      title: text,
      showConfirmButton: true,
      confirmButtonColor: '#364574',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }
    });
    
  }
  onEditResource(p:any){
    console.log(p.id,";;;;;;;;;;;;;;")
    let url = `${this.rnpService.host}/appUsers/${p.id}`;
     this.router.navigateByUrl("users/edit/"+btoa(url))
  }  
  onSelectedSize(e){
this.size = e.target.value
this.getDisplayRange()
if(this.districtSelected==false)
{this.getResourcesCommon(0)
console.log("lllllllllllllllllllllllllllllll")}
else{
  console.log("rrrrrrrrrrrrrrrrrrrrrr")
this.onRowClickCommon(this.selectedE)
}
  }
  goToPreviousPage() {
    if (this.currentPage > 0) {
        this.currentPage--;
        // You can add logic here to update data based on the new current page
    }
    this.onPageClicked(this.currentPage)
    this.getDisplayRange()
}
goToNextPage() {
  if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      // You can add logic here to update data based on the new current page
  }
  this.onPageClicked(this.currentPage)
 
}
getDisplayRange(): string {
  let startEntry = ((Number(this.currentPage) - 1) * Number(this.size) + 1)+Number(this.size);
  let start = startEntry+this.size
  console.log(startEntry,"ssssssssssssssss")
  console.log(this.size,"size")
   let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
 console.log(this.currentPage,'mmmmmmmmmmmmmm')
  if (this.appUsers?.length==0) {
    return `No entries to display`;
}

  return ` إظهار ${Number(startEntry)} إلى ${Number(endEntry)} من أصل   ${Number(this.totalCount)}`;
}

onUpdatePassword(p){
  this.router.navigateByUrl("changePassword/"+p.id)

}
uploadFile(){
  
}
}

