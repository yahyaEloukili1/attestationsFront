import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { number } from 'echarts';

@Component({
  selector: 'app-annexes-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './annexes-list.component.html',
  styleUrl: './annexes-list.component.scss'
})
export class AnnexesListComponent {

  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  annexes
  selectedDistrict = ""
  districts
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
  this.rnpService.getResourceAll('annexes').subscribe(data=>{
    let annexes = data['_embedded'].annexes
    if(annexes){
    this.totalCount = annexes.length}
    


})
this.rnpService.getResource("annexes",page,this.size).subscribe(data=>{
  this.annexes = data['_embedded'].annexes
  console.log(data,'vvvvv')
 this.totalPages = data['page'].totalPages
 this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
onRowClick(e){
this.selectedE = e

this.districtSelected = true
this.currentPage = 0
if(e==0){
this.getResourcesCommon(this.currentPage)
}else{


const url = `districts2/${e}/annexes?page=${0}&size=${this.size}`;

this.rnpService.getResourceAll2(url).subscribe(data=>{
  this.annexes = data['annexes']
  this.totalPages = Math.ceil(data['totalElements'] / this.size);
    this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
}

  onRowClickCommon(e, page = 0) {
    this.selectedE = e;
    this.districtSelected = true;
    this.currentPage = page;
  
    if (e == 0) {
      this.getResourcesCommon(this.currentPage);
   
      
    } else {

      const url = `districts2/${e}/annexes?page=${this.currentPage}&size=${this.size}`;
  
      this.rnpService.getResourceAll2(url).subscribe(
        data => {
         
          this.annexes = data['annexes'];
    
          this.totalPages = Math.ceil(data['totalElements'] / this.size);
          this.pages = new Array<number>(this.totalPages);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
  
getDistricts(){
  this.rnpService.getResourceAll('districts').subscribe(data=>{
    this.districts = data['_embedded'].districts
    console.log(this.districts)

})
}
addResource(){
    this.router.navigateByUrl("annexes/add")

}
onDeleteResource(p){
this.modelWarning().then(result => {
    if (result.value) {
      if(this.districtSelected==false){
        let url = p['_links'].self.href
        this.rnpService.deleteResource('annexes',url).subscribe(data=>{
          this.getResourcesCommon(0)
          this.modelSuccess('لقد تم حذف الملحقة')
    
           },err=>{
            this.modelError('لا يمكن حدف الملحقة')
        
           })
      }else{
        
        this.rnpService.deleteResource('annexes',`${this.rnpService.host}/annexes/${p.id}`).subscribe(data=>{
          this.onRowClickCommon(this.selectedE)
          this.modelSuccess('لقد تم حذف الملحقة')
           },err=>{
            this.modelError('لا يمكن حدف الملحقة')
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
    let url = `${this.rnpService.host}/annexes/${p.id}`;
    this.router.navigateByUrl("annexes/edit/"+btoa(url))
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
   let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
  if (this.annexes?.length==0) {
    return `No entries to display`;
}
  return ` إظهار ${Number(startEntry)} إلى ${Number(endEntry)} من أصل  ${Number(this.totalCount)}`;
}
}

