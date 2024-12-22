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
  dateOfBirthValue
  typeAttestations: any;
  citoyen: any;
  constructor(private pdiService: restApiService, private router: Router) { }

  ngOnInit(): void {
    this.getReources()
    const today = new Date();
    this.dateOfBirthValue = today.toISOString().split('T')[0];
  }
  getReources(){
    this.pdiService.getResourceAll('agentAutorites').subscribe(data=>{
      this.agentAutorites = data['_embedded'].agentAutorites 
      console.log(this.agentAutorites,"77777777"); 
    })
    this.pdiService.getResourceAll('typeAttestations').subscribe(data=>{
      this.typeAttestations = data['_embedded'].typeAttestations 
      console.log(this.typeAttestations,"77777777"); 
    })
    }
  searchByCin(){
    let url = `${this.pdiService.host}/citoyens/search/findByCin2?cin=${this.cin}`;
    this.pdiService.getOneResource(url).subscribe(data=>{
      let citoyens = data['_embedded'].citoyens
      this.citoyen = citoyens[0]
      console.log(citoyens,",,,,,,,,,,,,,,");
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
  onSaveResource(f:NgForm){
    this.formSubmitted = true;
    // console.log(f.value,"leleldr");
    // if(!f.valid){
    // this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
    // }
    // else{
     
       f.value.typeAttestation = `${this.pdiService.host}/typeAttestations/${f.value.typeAttestation}`
       f.value.agentAutorite= `${this.pdiService.host}/agentAutorites/${f.value.agentAutorite}`
      f.value.citoyen= `${this.pdiService.host}/citoyens/${this.citoyen['id']}`
      f.value.cin = this.cin
       console.log(f.value,'krkrkrk');
      this.pdiService.addResource("attestations",f.value).subscribe(data=>{
      this.reset(f)
      this.display = false
      this.formSubmitted  = false
      this.modelSuccess('تم حفظ الشهادة بنجاح')
            },err=>{
              this.modelError('يتعذر إضافة الشهادة')
            })
    }
  // }
  

}
