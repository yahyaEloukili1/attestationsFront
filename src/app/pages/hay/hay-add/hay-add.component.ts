import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hay-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hay-add.component.html',
  styleUrl: './hay-add.component.scss'
})
export class HayAddComponent {
  pachaliks
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    
  }



  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
         
          this.pdiService.addResource("quartiers",f.value).subscribe(data=>{
      this.reset(f)
          this.formSubmitted  = false
          this.modelSuccess('تم حفظ الحي بنجاح')
                },err=>{
                  this.modelError('يتعذر إضافة الحي')
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
  reset(f){
    f.reset()
   
  }
  gotoList(){
    this.router.navigateByUrl('sgi/districts');
  }
  

}
