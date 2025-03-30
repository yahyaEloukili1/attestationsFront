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
  annexes: any;
  annexeIdOfUserConnected: any;
  
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
    this.getConnectedUserAnnexeAndAnnexeNameOfUSerAalConnected()
  }
  getConnectedUserRole(){
    if(this.pdiService.loadToken()){
      return JSON.parse(atob(this.pdiService.loadToken().split('.')[1])).roles[0].authority
    }
   }
   getConnectedUserAnnexeAndAnnexeNameOfUSerAalConnected(){
    let user;
    if(this.pdiService.loadToken())
        user=  JSON.parse(atob(this.pdiService.loadToken().split('.')[1])).sub;
      console.log(user);
      this.pdiService.getOneResource(`${this.pdiService.host}/appUsers/search/findByUsername?username=${user}`).subscribe(data => {
this.annexeIdOfUserConnected = data['_embedded'].appUsers[0].annexe.id




    })
   
  }
 
  getReources(){
    this.pdiService.getResourceAll('fonctions').subscribe(data=>{
      this.fonctions = data['_embedded'].fonctions  
  })
  this.pdiService.getResourceAll('annexes').subscribe(data=>{
    this.annexes = data['_embedded'].annexes  
})
  }
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
        if(!f.valid){
        this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
        }
        else{
         if(this.getConnectedUserRole()=='USER-AAL'){
             f.value.annexe = `${this.pdiService.host}/annexes/${this.annexeIdOfUserConnected}`
              f.value.fonction = `${this.pdiService.host}/fonctions/${f.value.fonction}`
             console.log(f.value,"ededpoiu");
         }else{
  f.value.fonction = `${this.pdiService.host}/fonctions/${f.value.fonction}`
                    f.value.annexe = `${this.pdiService.host}/annexes/${f.value.annexe}`
         }
        
          this.pdiService.addResource("agentAutorites",f.value).subscribe(data=>{
        this.reset(f)
          this.formSubmitted  = false
          this.modelSuccess('تم حفظ عوان السلطة بنجاح')
                },err=>{
                  console.log(err,"qsq");
                  if(err!.error!.cause!.cause!.message!.includes("Duplicate entry")){
                    this.modelError('يوجد عون سلطة آخر بنفس رقم البطاقة الوطنية')
                  }else{
                    this.modelError('يتعذر إضافة عوان السلطة')
                  }
                  
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
    f.form.controls['annexe'].setValue('');
  }
  gotoList(){
    this.router.navigateByUrl('sgi/agents');
  }
  

}
