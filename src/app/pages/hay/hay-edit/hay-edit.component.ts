import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hay-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hay-edit.component.html',
  styleUrl: './hay-edit.component.scss'
})
export class HayEditComponent {
  url
  currentResource
  pachaliks
  pachalik
  selectedPachalik
  formSubmitted
    constructor(private router:Router,private activatedRoute: ActivatedRoute,private myService: restApiService) { }
  
    ngOnInit(): void {
      
      this.url = atob(this.activatedRoute.snapshot.params['id'])
     this.myService.getOneResource(this.url).subscribe(data=>{
       this.currentResource = data;
       console.log(this.currentResource,'vvvvvvvvvvvvvvvvvvvv')
       
     },err=>{
       console.log(err)
     })

   }
   getId(url){
    console.log(url,'pppppppppppppp')
    this.myService.getOneResource(url).subscribe(data=>{
    this.pachalik = data.id

    })

 
 
  }
  onRowClick(e){
    this.selectedPachalik = e
}
   
  onUpdateResource(f: any){
    this.formSubmitted = true;
    if(!f.valid){
      this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
      }
      else{
       
         this.myService.updateResource(this.url,f.value).subscribe(data=>{
          this.formSubmitted  = false
          this.modelSuccess('تم تبديل الدائرة بنجاح')
         },err=>{
          this.modelError('يتعذر تبديل الدائرة')
         })
      }
   
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
   gotoList(){
     this.router.navigateByUrl('sgi/districts');
   }
   reset(f){
    f.form.controls['designation'].setValue(this.currentResource.designation)
    f.form.controls['designationFr'].setValue(this.currentResource.designationFr)
    f.form.controls['pachalik'].setValue(this.pachalik);
  }
  }
  