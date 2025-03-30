import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agents-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './agents-edit.component.html',
  styleUrl: './agents-edit.component.scss'
})
export class AgentsEditComponent {
 url
  currentResource
  annexes
  annexe
  selectedannexe
  formSubmitted
  fonctions: any;
  selectedFonction: any;
  fonction: any;
    constructor(private router:Router,private activatedRoute: ActivatedRoute,private myService: restApiService) { }
  
    ngOnInit(): void {
      this.getReources()
      this.url = atob(this.activatedRoute.snapshot.params['id'])
     this.myService.getOneResource(this.url).subscribe(data=>{
       this.currentResource = data;
       let inputString = this.currentResource._links.annexe.href
       let inputStringFonction = this.currentResource._links.fonction.href


       // Use the replace method to remove "{?projection}"
       let outputString = inputString.replace('{?projection}', '');
       let outputStringFonction = inputStringFonction.replace('{?projection}', '');
       
       console.log(outputString);
       
        this.getId(outputString)
        this.getIdFonction(outputStringFonction)
     },err=>{
       console.log(err)
     })

   }
   getConnectedUserRole(){
    if(this.myService.loadToken()){
      return JSON.parse(atob(this.myService.loadToken().split('.')[1])).roles[0].authority
    }
   }
   getId(url){
    console.log(url,'pppppppppppppppppppppp')
    this.myService.getOneResource(url).subscribe(data=>{
    this.annexe = data.id
console.log(this.annexe,"^^^^^^^^^^^^^^^^")
    })

 
 
  }
  getIdFonction(url){
    console.log(url,'pppppppppppppppppppppp')
    this.myService.getOneResource(url).subscribe(data=>{
    this.fonction = data.id
console.log(this.fonction,"^^^^^^^^^^^^^^^^")
    })

 
 
  }
  onAnnexeClicked(e){
    this.selectedannexe = e
}
onFonctionClicked(e){
  this.selectedFonction = e
}
   getReources(){
    this.myService.getResourceAll('annexes').subscribe(data=>{
      this.annexes = data['_embedded'].annexes  
  })
  this.myService.getResourceAll('fonctions').subscribe(data=>{
    this.fonctions = data['_embedded'].fonctions  
})
  }
  onUpdateResource(f: any){
    this.formSubmitted = true;
    if(!f.valid){
      this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
      }
      else{
        if(this.selectedannexe){
          f.value.annexe = `${this.myService.host}/annexes/${this.selectedannexe}`
        }else{
          f.value.annexe = `${this.myService.host}/annexes/${this.annexe}`
        }
        if(this.selectedFonction){
          f.value.fonction = `${this.myService.host}/fonctions/${this.selectedFonction}`
        }else{
          f.value.fonction = `${this.myService.host}/fonctions/${this.fonction}`
        }
         this.myService.updateResource(this.url,f.value).subscribe(data=>{
          this.formSubmitted  = false
          this.modelSuccess('تم تبديل عون السلطة بنجاح')
         },err=>{
          this.modelError('يتعذر تبديل عون السلطة')
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
     this.router.navigateByUrl('sgi/annexes');
   }
   reset(f){
    f.reset()
    f.form.controls['fonction'].setValue('');
    f.form.controls['annexe'].setValue('');
  }
  }