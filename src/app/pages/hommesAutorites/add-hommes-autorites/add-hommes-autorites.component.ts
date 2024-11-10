import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-hommes-autorites',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-hommes-autorites.component.html',
  styleUrl: './add-hommes-autorites.component.scss'
})
export class AddHommesAutoritesComponent {
  fonctions
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }

  getReources(){
    this.pdiService.getResourceAll('fonctionHommeAUtorites').subscribe(data=>{
      this.fonctions = data['_embedded'].fonctionHommeAUtorites  
      console.log(this.fonctions,"zdzde")
  })
  }
  onSaveResource(f:NgForm){
    console.log(f.value,"sqqs")
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
          console.log(f.value,"sqqs")
          f.value.fonctionHommeAUtorite = `${this.pdiService.host}/fonctionHommeAUtorites/${f.value.fonctionHommeAUtorite}`
          this.pdiService.addResource("hommeAutorites",f.value).subscribe(data=>{
            //  this.reset(f)
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
    f.form.controls['fonction'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/agents');
  }
  

}
