import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-attestation',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-attestation.component.html',
  styleUrl: './add-attestation.component.scss'
})
export class AddAttestationComponent {
  pachaliks
  formSubmitted: boolean = false;
  cin
  display = false
  currentResource
  agentAutorites: any;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
  }
  getReources(){
    this.pdiService.getResourceAll('agentAutorites').subscribe(data=>{
      this.agentAutorites = data['_embedded'].agentAutorites 
      console.log(this.agentAutorites,"77777777"); 
    })
    }
  searchByCin(){
    let url = `${this.pdiService.host}/citoyens/search/findByCin2?cin=${this.cin}`;
    this.pdiService.getOneResource(url).subscribe(data=>{
      let citoyens = data['_embedded'].citoyens
      if(citoyens.length<1){
        this.modelError("لا يوجد مواطن بهذا الرقم");
        this.display = false
      }
      else{
        this.display =true
        this.currentResource = citoyens[0]
      }
    })
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
