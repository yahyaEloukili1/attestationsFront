import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-districts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './districts-list.component.html',
  styleUrl: './districts-list.component.scss'
})
export class DistrictsListComponent {
  districts
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
   this.getReources()

}
getReources(){
  this.rnpService.getResourceAll('districts').subscribe(data=>{
    this.districts = data['_embedded'].districts
    console.log(this.districts,"zzzz")

})
}
addResource(){
    this.router.navigateByUrl("districts/add")

}
onDeleteResource(url:string){
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
    this.rnpService.deleteResource('districts',url).subscribe(data=>{
      this.getReources()
      Swal.fire({text:'لقد تم حذف الدائرة', confirmButtonColor: '#364574',   customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }, icon: 'success',});
       },err=>{
        this.modelError('لا يمكن حدف الدائرة')
       })

  }
});
 
}
onEditResource(p:any){
 
  let url = p['_links'].self.href;
  this.router.navigateByUrl("districts/edit/"+btoa(url))
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
}