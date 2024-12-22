import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shari3-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './shari3-add.component.html',
  styleUrl: './shari3-add.component.scss'
})
export class Shari3AddComponent {
  quartiers
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }

  getReources(){
    this.pdiService.getResourceAll('quartiers').subscribe(data=>{
      this.quartiers = data['_embedded'].quartiers  
  })
  }
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
          f.value.quartier = `${this.pdiService.host}/quartiers/${f.value.quartier}`
          console.log(f.value,"zzzzzzzzzzzzzz")
          this.pdiService.addResource("rues",f.value).subscribe(data=>{
        this.reset(f)
          this.formSubmitted  = false
          this.modelSuccess('تم حفظ الشارع بنجاح')
                },err=>{
                  this.modelError('يتعذر إضافة الشارع')
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
    f.form.controls['quartier'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/districts');
  }
  

}

