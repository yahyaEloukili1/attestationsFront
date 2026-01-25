import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-citoyens-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './citoyens-edit.component.html',
  styleUrl: './citoyens-edit.component.scss'
})
export class CitoyensEditComponent {
  annexes
  districts
  @ViewChild('fileInput') fileInput!: ElementRef;
  pachaliks: any;
  pachalik
  ruee
  showDistrict = false
  showAnnexe = false
  selectedPachalik
  currentUser
  sexe=""
  situatione=""
  editPhoto = true
  selectedFile
  hay
  chari3
  zanqa
  progress
  formSubmitted
  currentFileUpload
  selectedFileCin1
  selectedFileCin2
  sex
  selectedAnnexe
  a=""
  d=""
  user: { role: { id: number, roleName: string } } = { role: null };
  cinn: any;
  usersWithCinLength: any;
  cinError: boolean;
  phone: any;
  usersWithTeleLength: any;
  teleError: boolean;
  emaill: any;
  usersWithEmailLength: number;
  emailError: boolean;situation
  quartiers: any;
  rues: any;
  ruelles: any;
  quartier: any;
  showRue: boolean;
  showRuelle: boolean;
  ruellee: string;
  selectedExtrait: any;
  currentFileUploadExtrait: any;
  currentFileUploadCin1: any;
  currentFileUploadCin2: any;
ngOnInit(): void {
  this.getReources()
  this.getAnnexes()
  this.getDistricts()
  this.getPachaliks()
  this.getQuartiers()
  this.getRues()
  this.getRuelles()
}




getAnnexes(){
  this.restService.getResourceAll('annexes').subscribe(data=>{
     this.annexes = data['_embedded'].annexes
  
})
}
getDistricts(){
  this.restService.getResourceAll('districts').subscribe(data=>{
     this.districts = data['_embedded'].districts

})
}
getQuartiers(){
  this.restService.getResourceAll('quartiers').subscribe(data=>{
     this.quartiers = data['_embedded'].quartiers

})
}
getRues(){
  this.restService.getResourceAll('rues').subscribe(data=>{
     this.rues = data['_embedded'].rues
  
})
}
getRuelles(){
  this.restService.getResourceAll('ruelles').subscribe(data=>{
     this.ruelles = data['_embedded'].ruelles

})
}
getPachaliks(){
  this.restService.getResourceAll('pachaliks').subscribe(data=>{
     this.pachaliks = data['_embedded'].pachaliks

})
}
onQuartierChanged(e){
  this.showRue = true
  this.quartier = e
  this.showRuelle = false
  this.ruee = ""
  this.restService.getOneResource(`${this.restService.host}/rues/search/findRuesByquartierId?quartierId=${e}`).subscribe(data => {
    this.rues = data['_embedded'].rues;
  });
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
    console.log(f.controls,"ppppppppppppppppppppp")
    const fileInput = f.controls['fileInput'] as HTMLInputElement;
    console.log(fileInput,"azazazazazaaa")
    f.reset()
    
  this.showDistrict=false
  this.showAnnexe=false
this.showRue = false
this.showRuelle = false
  }
  onRueChanged(e){
    this.ruellee = ""
    this.showRuelle = true
    this.restService.getOneResource(`${this.restService.host}/ruelles/search/findRuellesByRueId?rueId=${e}`).subscribe(data => {
      this.ruelles = data['_embedded'].ruelles;
    
    });
    }
onDitrictChanged(e){
this.a = ""
this.showAnnexe = true
this.restService.getOneResource(`${this.restService.host}/annexes/search/findAnnexesByDistrictId?districtId=${e}`).subscribe(data => {
  this.annexes = data['_embedded'].annexes;

});
}
onPachalikChanged(e){
  this.showDistrict = true
  this.pachalik = e
  this.d= ""
  this.showAnnexe = false
  this.restService.getOneResource(`${this.restService.host}/districts/search/findDistrictsByPachalikId?pachalikId=${e}`).subscribe(data => {
    this.districts = data['_embedded'].districts;
  });
  }

getReources(){
  this.restService.getResourceAll('annexes').subscribe(data=>{
    this.annexes = data['_embedded'].annexes
    console.log(this.annexes)

})
}
constructor(public restService: restApiService){}
findUserByCin(){
  this.restService.getOneResource(`${this.restService.host}/citoyens/search/findByCin2?cin=${this.cinn}`).subscribe(data => {
    console.log(data['_embedded'].citoyens,'dedede')
 this.usersWithCinLength = data['_embedded'].citoyens.length
if(this.usersWithCinLength!=0){
  this.cinError = true
  
}else if(this.usersWithCinLength==0){
  this.cinError=false
}
console.log(this.cinError,"mmmmm")
  
  });
}
findUserTele(){
  this.restService.getOneResource(`${this.restService.host}/citoyens/search/findByPhone?phone=${this.phone}`).subscribe(data => {
   
 this.usersWithTeleLength = data['_embedded'].citoyens.length
if(this.usersWithTeleLength!=0){
  this.teleError = true
  
}else if(this.usersWithTeleLength==0){
  this.teleError=false
}

  
  });
}
findUserByEmail(){
  this.restService.getOneResource(`${this.restService.host}/citoyens/search/findByEmail?email=${this.emaill}`).subscribe(data => {
 this.usersWithEmailLength = data['_embedded'].citoyens.length
if(this.usersWithEmailLength!=0){
  this.emailError = true
  
}else if(this.usersWithEmailLength==0){
  this.emailError=false
}
console.log(this.emailError,"mmmmm")
  
  });
}
onEditPhoto(u){
this.currentUser = u;
this.editPhoto = true
}
onSelectedFile(event){
this.selectedFile = event.target.files;
}
onSelectedFileExtraitNaissance(event){
  this.selectedExtrait = event.target.files;
  }
onSelectedFileCin1(event){
  this.selectedFileCin1 = event.target.files;
  }
  onSelectedFileCin2(event){
    this.selectedFileCin2 = event.target.files;
    }

    uploadPhoto(f:NgForm){
      this.formSubmitted =true
      
        if(f.valid){
   
        if(this.selectedFile || this.selectedExtrait || this.selectedFileCin1 || this.selectedFileCin2){
          console.log("wwwwwwwwwww")
          this.progress = 0;
          if(this.selectedFile)
          this.currentFileUpload= this.selectedFile.item(0)
        if(this.selectedExtrait)
          this.currentFileUploadExtrait= this.selectedExtrait.item(0)
        if(this.selectedFileCin1)
          this.currentFileUploadCin1= this.selectedFileCin1.item(0)
        if(this.selectedFileCin2)
          this.currentFileUploadCin2= this.selectedFileCin2.item(0)
          delete f.value.confirmPass;
          delete f.value.fileInput1;
          delete f.value.fileInput2;
          delete f.value.fileInput3;
          delete f.value.fileInput4;
        if(f.value.district)
         f.value.district = {id: f.value.district}
        if(f.value.annexe)
      f.value.annexe = {id: f.value.annexe}
      if(f.value.pachalik)
          f.value.pachalik = {id: f.value.pachalik}
      if(f.value.rue)
        f.value.rue = {id: f.value.rue}
        if(f.value.quartier)
        f.value.quartier = {id: f.value.quartier}
        if(f.value.ruelle)
            f.value.ruelle = {id: f.value.ruelle}
        if(f.value.sex)
          f.value.sex = {id: f.value.sex}
        if(f.value.situation)
          f.value.situation = {id: f.value.situation}
  console.log(this.currentFileUploadExtrait,"szszszs")
      this.restService.uploadPhotoCitoyen(this.currentFileUpload,this.currentFileUploadExtrait,this.currentFileUploadCin1,this.currentFileUploadCin2,f.value).subscribe(event=>{
      
      if(event.type === HttpEventType.UploadProgress){
      this.progress = Math.round(100 * event.loaded /event.total);
      } 
      else if(event instanceof HttpResponse){
    
      this.showDistrict=false
      this.showAnnexe=false
      this.modelSuccess('تم حفظ المستعمل بنجاح')
      this.formSubmitted = false
      
      this.reset(f)
      }
      },err=>{
      // if(err?.error?.includes("DataIntegrityViolationException")){
      //   this.modelError(('يوجد مستخدم آخر بنفس اسم المستخدم في قاعدة البيانات '))
        
        
      // }else{
        this.modelError(('يتعذر إضافة المستعمل'))
      
      // }
      
      })
      
      
      
      }else{
      delete f.value.confirmPass;
          if(f.value.district)
          f.value.district = {id: f.value.district}
          if(f.value.annexe)
          f.value.annexe = {id: f.value.annexe}
          if(f.value.pachalik)
              f.value.pachalik = {id: f.value.pachalik}

          if(f.value.rue)
            f.value.rue = {id: f.value.rue}
            if(f.value.quartier)
            f.value.quartier = {id: f.value.quartier}
            if(f.value.ruelle)
                f.value.ruelle = {id: f.value.ruelle}
            if(f.value.sex)
              f.value.sex = {id: f.value.sex}
            if(f.value.situation)
              f.value.situation = {id: f.value.situation}
          
        
    console.log(f.value,"vsvsvsvsvsvsv")
        this.restService.addResource("registerCitoyen",f.value).subscribe(data=>{
      
        this.modelSuccess('dتم حفظ المستعمل بنجاح')
        this.formSubmitted = false
        // this.router.navigateByUrl("/provinceLaayoune")
        // this.reset(f)
        this.reset(f)
            },err=>{
            
                this.modelError(('يرجى التأكد من المعلومات وإعادة المحاولة '))
      
             
              
            })
      
      }
     
      
        }
        else{
          this.modelError(('يرجى التأكد من المعلومات وإعادة المحاولة '))
        }
      }







    }
