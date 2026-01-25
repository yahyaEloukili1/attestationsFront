import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { circle, latLng, tileLayer } from 'leaflet';

import { BestSelling, Recentelling, TopSelling, statData } from 'src/app/core/data';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { rest } from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users-add.component.html',
  styleUrl: './users-add.component.scss'
})
export class UsersAddComponent {
  currentUser
  editPhoto = true
  selectedFile
  progress
  formSubmitted = false
  annexes
  
  districts
  rolee=""
  currentFileUpload
  d:any  =""
  a:any  =""
  user: { role: { id: number, roleName: string } } = {role : {id : 0, roleName: ""}}
  pachaliks: any;
  pachalik
  showPachalik = false
  showDistrict = false
  showAnnexe = false
  selectedPachalik
  confirmPasswordError
  userName
  pass
  confirmPa
  cinn
  emaill
  @ViewChild('fileInput') fileInput: ElementRef;
  usersWithUserNameLength: any;
  userNameError= false;
  usersWithEmailLength: any;
  emailError: boolean = false;
  usersWithCinLength: any;
  cinError: boolean =false;
  teleError: boolean =false;
  usersWithTeleLength: number;
  phone: any;
  

ngOnInit(): void {
  this.getAnnexes()
  this.getDistricts()
  this.getPachaliks()
}
constructor(public restService: restApiService,private router: Router){}

onEditPhoto(u){
this.currentUser = u;
this.editPhoto = true
}
onSelectedFile(event){
this.selectedFile = event.target.files;
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
getPachaliks(){
  this.restService.getResourceAll('pachaliks').subscribe(data=>{
     this.pachaliks = data['_embedded'].pachaliks

})
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
  this.showAnnexe = false
  this.restService.getOneResource(`${this.restService.host}/districts/search/findDistrictsByPachalikId?pachalikId=${e}`).subscribe(data => {
    this.districts = data['_embedded'].districts;
  });
  }
onRoleSelected(e){
this.showDistrict= false
if(e==3){
  this.showPachalik = true
}else{
  this.showPachalik = false
}

this.showAnnexe=false


}
findUserByUserName(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByUsername?username=${this.userName}`).subscribe(data => {
 this.usersWithUserNameLength = data['_embedded'].appUsers.length
if(this.usersWithUserNameLength!=0){
  this.userNameError = true
  
}else if(this.usersWithUserNameLength==0){
  this.userNameError=false
}
console.log(this.userNameError,"mmmmm")
  
  });
}
findUserByEmail(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByEmail?email=${this.emaill}`).subscribe(data => {
 this.usersWithEmailLength = data['_embedded'].appUsers.length
if(this.usersWithEmailLength!=0){
  this.emailError = true
  
}else if(this.usersWithEmailLength==0){
  this.emailError=false
}
console.log(this.emailError,"mmmmm")
  
  });
}
findUserByCin(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByCin2?cin=${this.cinn}`).subscribe(data => {
    console.log(data['_embedded'].appUsers,'dedede')
 this.usersWithCinLength = data['_embedded'].appUsers.length
if(this.usersWithCinLength!=0){
  this.cinError = true
  
}else if(this.usersWithCinLength==0){
  this.cinError=false
}
console.log(this.cinError,"mmmmm")
  
  });
}
findUserTele(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByPhone?phone=${this.phone}`).subscribe(data => {
   
 this.usersWithTeleLength = data['_embedded'].appUsers.length
if(this.usersWithTeleLength!=0){
  this.teleError = true
  
}else if(this.usersWithTeleLength==0){
  this.teleError=false
}

  
  });
}

uploadPhoto(f:NgForm){
this.formSubmitted =true

  if(f.valid){
if(this.pass!=this.confirmPa){
  this.modelError(('يرجى التأكد من المعلومات وإعادة المحاولة '))
}
else{
  if(this.selectedFile){
    this.progress = 0;
    this.currentFileUpload= this.selectedFile.item(0)
    delete f.value.confirmPass;
  if(f.value.district)
   f.value.district = {id: f.value.district}
  if(f.value.annexe)
f.value.annexe = {id: f.value.annexe}
if(f.value.pachalik)
    f.value.pachalik = {id: f.value.pachalik}
 
if(f.value.role)
f.value.role = {id: f.value.role}
this.restService.uploadPhotoUser(this.currentFileUpload,f.value).subscribe(event=>{

if(event.type === HttpEventType.UploadProgress){
this.progress = Math.round(100 * event.loaded /event.total);
} 
else if(event instanceof HttpResponse){
this.showPachalik=false
this.showDistrict=false
this.showAnnexe=false
this.modelSuccess('تم حفظ المستعمل بنجاح')
this.formSubmitted = false
this.router.navigateByUrl("/provinceLaayoune")
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
    
    if(f.value.role)
f.value.role = {id: f.value.role}
  this.restService.addResource("register",f.value).subscribe(data=>{

  this.modelSuccess('تم حفظ المستعمل بنجاح')
  this.formSubmitted = false
  // this.router.navigateByUrl("/provinceLaayoune")
  this.reset(f)
      },err=>{
      
          this.modelError(('يرجى التأكد من المعلومات وإعادة المحاولة '))

       
        
      })

}
}

  }
  else{
    this.modelError(('يرجى التأكد من المعلومات وإعادة المحاولة '))
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
this.showPachalik=false
this.showDistrict=false
this.showAnnexe=false
this.rolee= ""
}
}