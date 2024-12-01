import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attestations-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './attestations-list.component.html',
  styleUrl: './attestations-list.component.scss'
})
export class AttestationsListComponent {
cin
  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  attestations
  selectedDistrict = ""
  districts
  districtSelected = false
  selectedE
  totalCount
  typeAttestations: any;
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
    this.getAttestations()
    this.getTypeAttestations()
}

getAttestations(){

  this.rnpService.getResourceAll('attestations').subscribe(data=>{
    this.attestations = data['_embedded'].attestations

    console.log(this.attestations,"ppppppppppp")


})

}


 
getTypeAttestations(){
  this.rnpService.getResourceAll('typeAttestations').subscribe(data=>{
    this.typeAttestations = data['_embedded'].typeAttestations
    console.log(this.typeAttestations)

})
}
addResource(){
    this.router.navigateByUrl("attestations/add")

}
print(){

}
onDeleteResource(p){
this.modelWarning().then(result => {
    if (result.value) {
      if(this.districtSelected==false){
        let url = p['_links'].self.href
        this.rnpService.deleteResource('attestations',url).subscribe(data=>{
         
          this.modelSuccess('لقد تم حذف الملحقة')
    
           },err=>{
            this.modelError('لا يمكن حدف الملحقة')
        
           })
      }else{
        
        this.rnpService.deleteResource('attestations',`${this.rnpService.host}/attestations/${p.id}`).subscribe(data=>{
         
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
    let url = `${this.rnpService.host}/attestations/${p.id}`;
    this.router.navigateByUrl("attestations/edit/"+btoa(url))
  }  
  onSelectedSize(e){
this.size = e.target.value
this.getDisplayRange()
if(this.districtSelected==false)
{
console.log("lllllllllllllllllllllllllllllll")}
else{
  console.log("rrrrrrrrrrrrrrrrrrrrrr")

}
  }
  goToPreviousPage() {
    if (this.currentPage > 0) {
        this.currentPage--;
        // You can add logic here to update data based on the new current page
    }
    
    this.getDisplayRange()
}
goToNextPage() {
  if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      // You can add logic here to update data based on the new current page
  }
  
 
}
getDisplayRange(): string {
  let startEntry = ((Number(this.currentPage) - 1) * Number(this.size) + 1)+Number(this.size);
  let start = startEntry+this.size
   let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
  if (this.attestations?.length==0) {
    return `No entries to display`;
}
  return ` إظهار ${Number(startEntry)} إلى ${Number(endEntry)} من أصل  ${Number(this.totalCount)}`;
}
onRowClickCommon(e){

}


uploadFile(){
  this.rnpService.uploadFileWithData3()
}












}

