import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { di } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.scss'
})
export class UsersEditComponent {
  currentUser
  editPhoto = true
  url
  selectedFile
  progress
  currentFileUpload
  roles
  currentResource
  currentEmail
  currentUsername
  user: { role: { id: number, roleName: string } } = { role: { id: 2, roleName: 'USER-DSIT'} };
  // user: { role: { id: number, roleName: string } }= { role: {id: 1, roleName: 'ADMIN'} };
  role = { id: 1, roleName: 'ADMIN'};
  formSubmitted = false
  selectedRole
  annexes
  userName: string;
  usersWithCinLength: any;
  cinError: boolean=false;
  cinn: any;
  currentCin
  usersWithEmailLength: any;
  emailError: boolean;
  usersWithUserNameLength: any;
  userNameError: boolean;
  emaill: any;
  role2: any;
  phone: any;
  usersWithTeleLength: any;
  teleError: boolean;
  currentTele: any;
  showPachalik = false
  showDistrict = false
  showAnnexe = false
  pachaliks
  districts
  pachalik: any;
  a ="";
  d =""
  selectedAnnexe: any;
  roleId: any;
  pachalik2: any;
  annexe2: any;
  district2: any;
  roleId2: any;
  district: any;
  annexe: any;

  onRowClick(e){
  this.selectedRole = e.id
  }
  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }
  ngOnInit(): void {
    this.getReources()
   
    this.url = atob(this.activatedRoute.snapshot.params['id'])
    console.log(this.url,'xxxxxxxxxx')
   this.restService.getOneResource(this.url).subscribe(data=>{
     this.currentResource = data;
   this.annexe2 = this.currentResource['_embedded']?.annexe.id
   this.district2 = this.currentResource['_embedded']?.district.id
     console.log(this.currentResource,",,,,,,,,,,,,,")
     this.currentCin = this.currentResource.cin
     this.currentTele = this.currentResource.phone
     this.currentUsername = this.currentResource.username
     this.currentEmail = this.currentResource.email
     let inputString = this.currentResource._links.role.href
     let inputStringPachalik = this.currentResource._links.pachalik.href




     // Use the replace method to remove "{?projection}"
     let outputString = inputString.replace('{?projection}', '');
     let outputStringPachalik = inputStringPachalik.replace('{?projection}', '');


     console.log(outputString,'fdfdfdf');

      this.getId(outputString)
      this.getId2(outputStringPachalik)
      this.getPachaliks()
    
      this.getAnnexes()
   },err=>{
     console.log(err)
   })

 }
 onRoleSelected(e){
  console.log("zezeze")
  this.selectedRole = e
  this.roleId= 0
  this.pachalik2 = ""
  this.district2=""
  this.annexe2=""
  this.showDistrict= false
  if(e==3){
    this.showPachalik = true

  }else{
    this.showPachalik = false
  }

  this.showAnnexe=false


  }
  onPachalikChanged(e){
    this.showDistrict = true
    this.pachalik = e
    this.showAnnexe = false
    this.restService.getOneResource(`${this.restService.host}/districts/search/findDistrictsByPachalikId?pachalikId=${e}`).subscribe(data => {
      this.districts = data['_embedded'].districts;
    });
    }
    onDitrictChanged(e){
      this.district = e
      this.a = ""
      this.showAnnexe = true
      this.restService.getOneResource(`${this.restService.host}/annexes/search/findAnnexesByDistrictId?districtId=${e}`).subscribe(data => {
        this.annexes = data['_embedded'].annexes;

      });
      }
      onAnnexeChanged(e){
        this.annexe = e
        console.log("mmmmmmmmmmmmmmmmmm")

        }
 getAnnexes(){
  console.log(this.district2,"vvvvvvvvvvvvvvvvv")
  this.restService.getOneResource(`${this.restService.host}/annexes/search/findAnnexesByDistrictId?districtId=${this.district2}`).subscribe(data => {
    this.annexes = data['_embedded'].annexes;

  });
}
getDistricts(e){
  console.log(this.pachalik2,"ezzzzzzzzzzzzzzzz")
  this.restService.getOneResource(`${this.restService.host}/districts/search/findDistrictsByPachalikId?pachalikId=${e}`).subscribe(data => {
    this.districts = data['_embedded'].districts;
    console.log(this.districts,"nbbbbbbbbbbbb")

  });
}
getPachaliks(){
  this.restService.getResourceAll('pachaliks').subscribe(data=>{
     this.pachaliks = data['_embedded'].pachaliks

})
}
 findUserByCin(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByCin2?cin=${this.cinn}`).subscribe(data => {
    console.log(data,'dedede')
 this.usersWithCinLength = data['_embedded'].appUsers.length
if(this.usersWithCinLength!=0 && this.currentCin!=data['_embedded'].appUsers[0].cin){
  this.cinError = true

}else{
  this.cinError=false
}
console.log(this.cinError,"mmmmm")

  });
}
findUserByEmail(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByEmail?email=${this.emaill}`).subscribe(data => {
 this.usersWithEmailLength = data['_embedded'].appUsers.length
if(this.usersWithEmailLength!=0 &&this.currentEmail!=data['_embedded'].appUsers[0].email){
  this.emailError = true

}else{
  this.emailError=false
}
console.log(this.emailError,"mmmmm")

  });
}
findUserByUserName(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByUsername?username=${this.userName}`).subscribe(data => {
 this.usersWithUserNameLength = data['_embedded'].appUsers.length
 console.log(data['_embedded'],"zzzzzzzzzzzzzzzzzz")
if(this.usersWithUserNameLength!=0 && this.currentUsername!=data['_embedded'].appUsers[0].username){
  this.userNameError = true

}else{
  this.userNameError=false
}
  });
}
findUserTele(){
  this.restService.getOneResource(`${this.restService.host}/appUsers/search/findByPhone?phone=${this.phone}`).subscribe(data => {

 this.usersWithTeleLength = data['_embedded'].appUsers.length
if(this.usersWithTeleLength!=0 && this.currentTele!=data['_embedded'].appUsers[0].phone){
  this.teleError = true

}else if(this.usersWithTeleLength==0){
  this.teleError=false
}


  });
}

getId(url: string) {
  console.log(url, "eiiiiii");
  // let u = url.slice(0,-9)
  console.log(url, '11111111111111&');

  this.restService.getOneResource(url).subscribe(data => {
    // Destructure the received data and create a new object without the _links property
    const { _links, ...newRole } = data;
this.role2 = newRole
this.roleId = this.role2?.id
this.roleId2 = this.role2.id
    // Assign the new object to this.role
    console.log(this.roleId,"xsxsdffg")

  });
}
getId2(url: string) {
  console.log(url, "eiiiiii");
  // let u = url.slice(0,-9)
  console.log(url, '11111111111111&');

  this.restService.getOneResource(url).subscribe(data => {
    // Destructure the received data and create a new object without the _links property
    const { _links, ...newRole } = data;
this.pachalik2 = newRole.id
this.getDistricts(this.pachalik2)

  });
}

constructor(public restService: restApiService,private activatedRoute: ActivatedRoute){}

onEditPhoto(u){
this.currentUser = u;
this.editPhoto = true
}
onSelectedFile(event){
this.selectedFile = event.target.files;
}
getReources(){
  this.restService.getResourceAll('appRoles').subscribe(data=>{
    this.roles = data['_embedded'].appRoles
})
}
 addIdToObject(obj, id) {
  return { ...obj, id };
}
uploadPhoto(f:NgForm){
  this.formSubmitted = true;
  if(f.valid){
    this.progress = 0;
    if(this.selectedFile){
      console.log()
     this.currentFileUpload= this.selectedFile.item(0)
     if(this.district)
      {
        f.value.district = {id: this.district}
      }else{
        f.value.district = {id: this.district2}
      }

     if(this.annexe){
      f.value.annexe = {id: this.annexe}
     }else{
      f.value.annexe = {id: this.annexe2}
     }

   if(this.pachalik){
    f.value.pachalik = {id: this.pachalik}
   }else{
    f.value.pachalik = {id: this.pachalik2}
   }


   if(this.selectedRole){
    f.value.role = {id: this.selectedRole}

   }else{
    console.log(this.currentResource,"nnnnnnnnnnnnnnnnnnnnnnnnnnnn")
    f.value.role = {id: this.roleId2}
   }
  let formData = {...f.value, id: this.currentResource.id }

    console.log(formData,'qxwxwwx')
    this.restService.uploadPhotoUser(this.currentFileUpload,formData).subscribe(event=>{
       console.log(f.value,"zkkk")
     if(event.type === HttpEventType.UploadProgress){
      this.progress = Math.round(100 * event.loaded /event.total);
     }
    else if(event instanceof HttpResponse){
      this.modelSuccess('تم حفظ المستعمل بنجاح')
      this.formSubmitted = false
    }
    },err=>{
      this.modelError(('يتعذر تبديل المستعمل'))
    })
    }else{
      console.log(f.value,"zzzzzzzzzzzzzzzzzzzzzzzzz")
      if( f.value.role){
        f.value.role = `${this.restService.host}/appRoles/${f.value.role}`
        console.log(f.value,"1111111111111")
      }else{
        f.value.role = `${this.restService.host}/appRoles/${this.role.id}`
        console.log(this.role,"222222222222222")
      }
      if(f.value.pachalik){
       f.value.pachalik = `${this.restService.host}/pachaliks/${ f.value.pachalik}`
      }

      if(f.value.district){
f.value.district = `${this.restService.host}/districts/${ f.value.district}`
      }

      if(f.value.annexe){
        console.log(f.value.annexe,"kkkkkkkkkkkkkkkkkkk")
  f.value.annexe = `${this.restService.host}/annexes/${ f.value.annexe}`

      }

   

      this.restService.updateResource(this.url,f.value).subscribe(data=>{
        this.modelSuccess('تم تبديل المستعمل بنجاح')
        this.formSubmitted=false
      },err=>{
        this.modelError(('يتعذر تبديل المستعمل'))
      })
    }
    }
    else{
      this.modelError(('يتعذر تبديل ا2لمستعمل'))
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
}
