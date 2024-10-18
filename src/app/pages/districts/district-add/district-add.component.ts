import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-district-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './district-add.component.html',
  styleUrl: './district-add.component.scss'
})
export class DistrictAddComponent  {
  pachaliks
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }

  getReources(){
    this.pdiService.getResourceAll('pachaliks').subscribe(data=>{
      this.pachaliks = data['_embedded'].pachaliks
      console.log(this.pachaliks)
  
  })
  }
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
          f.value.pachalik = `${this.pdiService.host}/pachaliks/${f.value.pachalik}`
          this.pdiService.addResource("districts",f.value).subscribe(data=>{
      this.reset(f)
          this.formSubmitted  = false
          this.modelSuccess('تم حفظ الدائرة بنجاح')
                },err=>{
                  this.modelError('يتعذر إضافة الدائرة')
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
    f.form.controls['pachalik'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/districts');
  }
  

}
