import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zanqa-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './zanqa-add.component.html',
  styleUrl: './zanqa-add.component.scss'
})
export class ZanqaAddComponent {
  quartiers
  rues
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }

  getReources(){
    this.pdiService.getResourceAll('rues').subscribe(data=>{
      this.rues = data['_embedded'].rues  
  })
  }
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
          f.value.rue = `${this.pdiService.host}/rues/${f.value.rue}`
          console.log(f.value,"zzzzzzzzzzzzzz")
          this.pdiService.addResource("ruelles",f.value).subscribe(data=>{
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
    f.form.controls['rue'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/districts');
  }
  

}

