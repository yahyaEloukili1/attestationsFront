import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-aagent',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-aagent.component.html',
  styleUrl: './add-aagent.component.scss'
})
export class AddAagentComponent {
  fonctions
  formSubmitted: boolean = false;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }

  getReources(){
    this.pdiService.getResourceAll('fonctions').subscribe(data=>{
      this.fonctions = data['_embedded'].fonctions  
  })
  }
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
          console.log(f.value,"sqqs")
          f.value.fonction = `${this.pdiService.host}/fonctions/${f.value.fonction}`
          this.pdiService.addResource("agentAutorites",f.value).subscribe(data=>{
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
    f.form.controls['fonction'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/agents');
  }
  

}
