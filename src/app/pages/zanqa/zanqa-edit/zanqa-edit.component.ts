import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zanqa-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './zanqa-edit.component.html',
  styleUrl: './zanqa-edit.component.scss'
})
export class ZanqaEditComponent {
  url
  currentResource
  rues
  rue
  selectedDistrict
  formSubmitted
    constructor(private router:Router,private activatedRoute: ActivatedRoute,private myService: restApiService) { }
  
    ngOnInit(): void {
      this.getReources()
      this.url = atob(this.activatedRoute.snapshot.params['id'])
     this.myService.getOneResource(this.url).subscribe(data=>{
       this.currentResource = data;
       let inputString = this.currentResource._links.district.href


       // Use the replace method to remove "{?projection}"
       let outputString = inputString.replace('{?projection}', '');
       
       console.log(outputString);
       
        this.getId(outputString)
     },err=>{
       console.log(err)
     })

   }
   getId(url){
    console.log(url,'pppppppppppppppppppppp')
    this.myService.getOneResource(url).subscribe(data=>{
    this.rue = data.id
console.log(this.rue,"^^^^^^^^^^^^^^^^")
    })

 
 
  }
  onRowClick(e){
    this.selectedDistrict = e
}
   getReources(){
    this.myService.getResourceAll('rues').subscribe(data=>{
      this.rues = data['_embedded'].rues  
  })
  }
  onUpdateResource(f: any){
    this.formSubmitted = true;
    if(!f.valid){
      this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
      }
      else{
        if(this.selectedDistrict){
          f.value.rue = `${this.myService.host}/rues/${this.selectedDistrict}`
        }else{
          f.value.rue = `${this.myService.host}/rues/${this.rue}`
        }
         this.myService.updateResource(this.url,f.value).subscribe(data=>{
          this.formSubmitted  = false
          this.modelSuccess('تم تبديل الدائرة بنجاح')
         },err=>{
          this.modelError('يتعذر تبديل الدائرة')
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
     this.router.navigateByUrl('sgi/districts');
   }
   reset(f){
    f.form.controls['designation'].setValue(this.currentResource.designation)
    f.form.controls['designationFr'].setValue(this.currentResource.designationFr)
    f.form.controls['rue'].setValue(this.rue);
  }
  }
  