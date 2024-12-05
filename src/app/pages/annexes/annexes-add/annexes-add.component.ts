import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-annexes-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './annexes-add.component.html',
  styleUrl: './annexes-add.component.scss'
})
export class AnnexesAddComponent {
  districts
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }

  getReources(){
    this.pdiService.getResourceAll('districts').subscribe(data=>{
      this.districts = data['_embedded'].districts  
  })
  }
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
          f.value.district = `${this.pdiService.host}/districts/${f.value.district}`
          this.pdiService.addResource("annexes",f.value).subscribe(data=>{
        this.reset(f)
          this.formSubmitted  = false
          this.modelSuccess('تم حفظ الملحقة بنجاح')
                },err=>{
                  this.modelError('يتعذر إضافة الملحقة')
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
    f.form.controls['district'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/districts');
  }
  

}
