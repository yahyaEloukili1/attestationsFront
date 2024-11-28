import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-test-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users-test-list.component.html',
  styleUrl: './users-test-list.component.scss'
})
export class UsersTestListComponent {
  cin
  size:number = 8
  currentPage:number = 0;
  totalPages: number;
  pages: Array<number>
  selected: boolean
  appUsers
  selectedDistrict:any = ""
  selectedAppRole:any = ""

  appRoles
  districts
  role = 0
  annexes
  roleSelected = false
  annexeSelected = false
  pachalikSelected = false
  districtSelected = false
  cinSelected = false
  selectedRole
  totalCount
  showAnnexeAndDistrict = false
  showAnnexe = false
  showDistrict = false
  pachaliks
  selectedAnnexe:any = ""
  showPachalik = false
  selectedPachalik:any = ""
  d
  a
  roleName
  annexeName: any;
  pachalikName: any;
  districtName: string;
  appUsersToPrint: any;
  pachalikForhtml
  districForHtml: string;
  annexeForHtml: string;
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
    this.getUsers(this.currentPage)
    this.getResourcesForDropDownList()
}
setTotalCount(){
  console.log('00000000000')
  this.rnpService.getResourceAll('appUsers').subscribe(data=>{
    let appUsers = data['_embedded'].appUsers
    this.appUsersToPrint = appUsers
    if(appUsers){
    this.totalCount = appUsers.length
  console.log(this.totalCount,'szszszszsz')
  }
})
}
setTotalCountForRoleSelected(e){
  this.cin = ""
  this.cinSelected = false
  this.selectedPachalik =""
 this.selectedDistrict = ""
 this.selectedAnnexe = ""
this.selectedRole = e
this.logique(e)
if(e==0){
  this.setTotalCount()
}
console.log(e,"444444444444")

}
logique(e){
  let a,r,d,p;
  a= this.selectedAnnexe == 0 || this.selectedAnnexe == "" ? undefined : this.selectedAnnexe;
  r= this.selectedRole == 0 || this.selectedRole == ""? undefined : this.selectedRole;
  p= this.selectedPachalik == 0 || this.selectedPachalik == ""? undefined : this.selectedPachalik;
  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  
    let url = `${this.rnpService.host}/appUsers/search/findByAppRoleIdAndPachalikIdAndDistrictIdAndAnnexeId2?`;

    if (r !== undefined) {
      url += `roleId=${r}`;
    }
  
     if (p !== undefined) {
      url += `&pachalikId=${p}`;
  }
  if (d !== undefined) {
    url += `&districtId=${d}`;
  }
  
     if (a !== undefined) {
       url += `&annexeId=${a}`;
     }
    
     console.log(url,'szszszzddd')
  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let appUsers = data['_embedded'].appUsers
       this.appUsersToPrint = appUsers
       if(appUsers){
       this.totalCount = appUsers.length
       console.log(appUsers,'lllszszszzddd')
      }
      },
      err => {
       console.log(err);
      }
      );
      
}

setTotalCountForPachalikSelected(e){
  this.cin = ""
  this.selectedPachalik = e;
  
  this.pachalikSelected = true;
  this.selectedDistrict = ""
  this.selectedAnnexe = ""
 this.logique(e)
   

 
 
}
setTotalCountForDistrictSelected(e){
  this.cin = ""
  this.selectedDistrict = e;
  
  this.districtSelected = true;
  this.selectedAnnexe = ""
 this.logique(e)

 
 
}
setTotalCountForAnnexeSelected(e){
  this.cin = ""
  this.selectedAnnexe = e;
  
  this.annexeSelected = true;

this.logique(e)
   

 
 
}
setTotalCountForCinSelected(){
  this.cinSelected = true
  this.currentPage = 0
  if(this.cin=="" || this.cin==undefined || this.cin==null){
this.getUsers2(0)
  }else{

  let url = `${this.rnpService.host}/appUsers/search/findByCin2?cin=`;
  this.rnpService.getOneResource(url+this.cin).subscribe(data=>{
  let appUsers = data['_embedded'].appUsers;
  this.appUsersToPrint = appUsers
  this.totalCount = appUsers.length
  })
}
}
onPageClicked(i:number){
console.log(this.cinSelected,'cin selected')
console.log(this.roleSelected,'role selected')
console.log(this.pachalikSelected,'pachalikSelected selected')
console.log(this.districtSelected,'district selected')
console.log(this.annexeSelected,'annexe selected')
  this.currentPage = i;
  if(this.cinSelected==true){
    if(this.cin=="" || this.cin==undefined || this.cin==null){
      console.log("aaaaa")
  this.getUsers2(i)
    }
    else{
      this.searchUser2(i)
    }
   

  }else{
if(this.roleSelected==false)
{this.getUsers(i)
  console.log("rfrfrfrf")
}
else{
  if(this.roleSelected==true && this.pachalikSelected ==false && this.districtSelected ==false && this.annexeSelected==false){
    this.onRoleClicked(this.selectedRole,this.currentPage)
    console.log("roleededed")
  }
  if(this.roleSelected==true && this.pachalikSelected ==true && this.districtSelected ==false && this.annexeSelected==false){
    this.onPachalikClicked(this.selectedPachalik,this.currentPage)
    console.log("pach")
  }
  if(this.roleSelected==true && this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==false){
    this.onDistrictClicked(this.selectedDistrict,this.currentPage)
    console.log("districtt")
  }
  if(this.roleSelected==true && this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true){
    this.onAnnexeClicked(this.selectedAnnexe,this.currentPage)
    console.log("annx")
  }

}
}
}
getUsers(page){
  this.cinSelected = false
 this.setTotalCount()
 this.rnpService.getResource("appUsers",page,this.size).subscribe(data=>{
  this.appUsers = data['_embedded'].appUsers
  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
getUsers2(page){
this.setTotalCount()
this.rnpService.getResource("appUsers",page,this.size).subscribe(data=>{
  this.appUsers = data['_embedded'].appUsers
  console.log(data,'vvvvv')
 this.totalPages = data['page'].totalPages
 this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}

onDetailResource(p){
  let url = `${this.rnpService.host}/appUsers/${p.id}`;
  this.router.navigateByUrl("users/detail/"+btoa(url))
}






onRoleClicked(e, page = 0) {
  console.log(e,'sqqsq')
  if(e!=0){
    this.setTotalCountForRoleSelected(e)
    this.rnpService.getOneResourceById("appRoles",e).subscribe(data=>{
      console.log(data.roleNameAr,"jhjjhjhh")
      this.roleName = data.roleNameAr
      this.roleName =  ' ذوي  صلاحية: '+ this.roleName
      this.pachalikForhtml = ""
      this.pachalikName = ""
      this.districtName = ""
      this.annexeName = ""
      this.annexeForHtml = ""
    })
  }else{
    this.roleName = ""
    this.pachalikName = ""
    this.pachalikForhtml= ""
    this.districtName = ""
    this.districForHtml = ""
    this.annexeName = ""
    this.annexeForHtml = ""
    this.setTotalCount()
  }

  this.cin = ""
  this.cinSelected = false
  if(e==3){
    this.showPachalik = true
  }
  else{
    this.showPachalik = false
    this.showAnnexe = false
    this.showDistrict = false
    
  }

 this.roleSelected = true;
 this.pachalikSelected = false
 this.districtSelected = false
 this.annexeSelected = false
 this.selectedRole = e;
 this.selectedPachalik =""
 this.selectedDistrict = ""
 this.selectedAnnexe = ""
 this.currentPage = page;
this.logique2()



 
}

onAnnexeClicked(e, page = 0) {
  this.setTotalCountForAnnexeSelected(e)
  this.cin = ""
  if(e!=0){
    this.rnpService.getOneResourceById("annexes",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.annexeName = data.designation
      this.annexeForHtml =  ', '+this.annexeName 
    })
  }else{
    this.annexeName = ""
    this.annexeForHtml = ""
  }
  this.selectedAnnexe = e;
  this.roleSelected = true;
  this.annexeSelected =  true
  this.pachalikSelected = true
  this.districtSelected = true
  this.currentPage = page;
 this.logique2()
 
  
 }

 onPachalikClicked(e, page = 0) {
  this.selectedPachalik = e;
  if(e!=0){
    this.rnpService.getOneResourceById("pachaliks",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.pachalikName = data.designation
      this.pachalikForhtml =  ', التابعين ل: '+ this.pachalikName
      this.districtName = ""
      this.districForHtml = ""
      this.annexeName= ""
      this.annexeForHtml = ""
    })
  }else if(e==0){
    this.pachalikName = ""
    this.pachalikForhtml = ""
    this.districForHtml = ""
    this.annexeForHtml = ""
this.districtName = ""
this.annexeName = ""
  }
  this.getDistricts(e)
  this.setTotalCountForPachalikSelected(e)
  this.cin = ""
  if(e==0){
   this.showDistrict = false
   this.showAnnexe = false
  }
  else{
    this.d= ''
    this.showDistrict =true
    this.showAnnexe = false
  }
 
  
  this.roleSelected = true;
  this.pachalikSelected =  true
  this.districtSelected = false
  this.annexeSelected = false
  this.selectedAnnexe =undefined

  this.selectedDistrict = ""
  this.currentPage = page;

 
 this.logique2()
 
  
 }
logique2(){

  let a,r,d,p;
  a= this.selectedAnnexe == 0 || this.selectedAnnexe == "" ? undefined : this.selectedAnnexe;
  r= this.selectedRole == 0 || this.selectedRole == ""? undefined : this.selectedRole;
  p= this.selectedPachalik == 0 || this.selectedPachalik == ""? undefined : this.selectedPachalik;
  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  
    let url = `${this.rnpService.host}/appUsers/search/findByAppRoleIdAndPachalikIdAndDistrictIdAndAnnexeId?`;
    if (r !== undefined) {
     url += `roleId=${r}`;
   }
 
    if (p !== undefined) {
     url += `&pachalikId=${p}`;
 }
 if (d !== undefined) {
   url += `&districtId=${d}`;
 }
 
    if (a !== undefined) {
      url += `&annexeId=${a}`;
    }
   
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.appUsers = data['_embedded'].appUsers;
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);
    console.log(this.appUsers,'xwx')
  },
  err => {
   console.log(err);
  }
  );
}
export(){
  // if(this.roleName){
  //   this.roleName = ''
  //   this.roleName =  'ذوي صلاحية '+ this.roleName
  // }
  if(!this.districtName){
    this.districtName = ''
  }
  if(!this.annexeName){
    this.annexeName = ''
  }
  if(!this.pachalikName){
    this.pachalikName = ''
  }
  if(!this.roleName){
    this.roleName = ''
  }
  if(this.cinSelected){
    this.roleName = this.cin + ' :رقم البطاقة الوطنية '
  }
 this.rnpService.uploadFileWithData(this.roleName,this.pachalikName,this.districtName,this.annexeName,this.appUsersToPrint)
}
 onDistrictClicked(e, page = 0) {
  this.getAnnexes(e)
  if(e!=0){
    this.rnpService.getOneResourceById("districts",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.districtName = data.designation
      this.annexeName = ""
      this.annexeForHtml = ""
      this.districForHtml    = ', ' + this.districtName 
    })
  }else{
    this.districtName = ""
    this.annexeName = ""
    this.annexeForHtml = ""
    this.districForHtml = ""
  }
  this.setTotalCountForDistrictSelected(e)
  this.cin = ""
  this.selectedDistrict = e;
  if(e==0){
    this.showAnnexe = false
    console.log("show annexe")
  }else{
    this.a= ''
    this.showAnnexe = true
  }
  this.selectedAnnexe = ""
  this.districtSelected =true
  this.roleSelected = true;
  this.pachalikSelected = true
  this.annexeSelected =false
  this.currentPage = page;
 this.logique2()
 
  
 }



























































 
 searchUser2(i){
  this.cinSelected = true
  console.log("search user")
  if(this.cinSelected){
    this.roleName = this.cin + ' :رقم البطاقة الوطنية '
  }
  this.rnpService.getResourceByKeyword("appUsers",i,this.size,this.cin,"Cin").subscribe(data=>{
    this.appUsers = data['_embedded'].appUsers;
    this.totalPages = data['page'].totalPages
    this.pages = new Array<number>(this.totalPages);
  })
 }

 searchUser(){


  this.setTotalCountForCinSelected()
  console.log(this.cin,"azazaz")
  this.cinSelected = true
  if(this.cinSelected && this.cin){
    console.log(this.cinSelected,"ededkjh")
    this.roleName =   '  أصحاب رقم البطاقة الوطنية: ' + this.cin
    console.log(this.roleName,"ededkjh")
  }else{
    this.roleName=""
  }
  this.showAnnexe = false
  this.showDistrict =false
  this.showPachalik = false
  this.pachalikForhtml = ""

  this.districForHtml = ""
  this.annexeForHtml=""
  this.pachalikName=""
  this.districtName=""
  this.annexeName=""
  
  this.currentPage = 0
  console.log("search user")
  if(this.cin=="" || this.cin==undefined || this.cin==null){
    console.log("aaaaa")
this.getUsers2(0)
  }else{

  
  this.rnpService.getResourceByKeyword("appUsers",0,this.size,this.cin,"Cin").subscribe(data=>{
    this.appUsers = data['_embedded'].appUsers;
    this.totalPages = data['page'].totalPages
    this.pages = new Array<number>(this.totalPages);
  })
}
 }
 onSelectedSize(e){
  this.size = e.target.value
  this.getDisplayRange()
  this.selectedAppRole=""
  
  // this.getUsers(0) 
  if(this.cinSelected==true){
    this.searchUser()
  }else{
    if(this.roleSelected==false)
    {this.getUsers(0)
    }
    else{
      if(this.roleSelected==true && this.pachalikSelected ==false && this.districtSelected ==false && this.annexeSelected==false){
        this.onRoleClicked(this.selectedRole,0)
        console.log("role")
      }
      if(this.roleSelected==true && this.pachalikSelected ==true && this.districtSelected ==false && this.annexeSelected==false){
        this.onPachalikClicked(this.selectedPachalik,0)
        console.log("pach")
      }
      if(this.roleSelected==true && this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==false){
        this.onDistrictClicked(this.selectedDistrict,0)
        console.log("districtt")
      }
      if(this.roleSelected==true && this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true){
        this.onAnnexeClicked(this.selectedAnnexe,0)
        console.log("annx")
      }
    }
  }
  
  }

























































 getResourcesForDropDownList(){
  this.getRoles()
  this.getPachaliks()
}


// getDistricts(){
//   this.rnpService.getResourceAll('districts').subscribe(data=>{
//     this.districts = data['_embedded'].districts

// })

// }
// getPachaliks(){
//   this.rnpService.getResourceAll('pachaliks').subscribe(data=>{
//     this.pachaliks = data['_embedded'].pachaliks

// })

// }
addResource(){
    this.router.navigateByUrl("users/add")

}
onDeleteResource(p){
  let url = `${this.rnpService.host}/appUsers/${p.id}`;
  this.router.navigateByUrl("users/delete/"+btoa(url))

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
  modelWarning(){
    return   Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سوف يتم الحذف بصفة نهائية!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#364574',
      cancelButtonColor: 'rgb(243, 78, 78)',
      cancelButtonText: 'إلغاء',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      },
      confirmButtonText: 'حذف'
    })
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
  onEditResource(p:any){
    console.log(p.id,";;;;;;;;;;;;;;")
    let url = `${this.rnpService.host}/appUsers/${p.id}`;
     this.router.navigateByUrl("users/edit/"+btoa(url))
  }  


  goToPreviousPage() {
    if (this.currentPage > 0) {
        this.currentPage--;
        // You can add logic here to update data based on the new current page
    }
    this.onPageClicked(this.currentPage)
    this.getDisplayRange()
}
goToNextPage() {
  if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      // You can add logic here to update data based on the new current page
  }
  this.onPageClicked(this.currentPage)
 
}
getDisplayRange(): string {
  let startEntry = ((Number(this.currentPage) - 1) * Number(this.size) + 1)+Number(this.size);
  let start = startEntry+this.size
  console.log(startEntry,"ssssssssssssssss")
  console.log(this.size,"size")
   let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
 console.log(this.currentPage,'mmmmmmmmmmmmmm')
  if (this.appUsers?.length==0) {
    return `No entries to display`;
}

  return ` إظهار ${Number(startEntry)} إلى ${Number(endEntry)} من أصل   ${Number(this.totalCount)}`;
}

onUpdatePassword(p){
  this.router.navigateByUrl("users/changePassword/"+p.id)

}








getRoles(){
  this.rnpService.getResourceAll('appRoles').subscribe(data=>{
    this.appRoles = data['_embedded'].appRoles
})

}
getPachaliks(){
  this.rnpService.getResourceAll('pachaliks').subscribe(data=>{
    this.pachaliks = data['_embedded'].pachaliks
})

}
getDistricts(e){
  this.rnpService.getResourceAll2('districts/search/findDistrictsByPachalikId?pachalikId='+e).subscribe(data=>{
    this.districts = data['_embedded'].districts
    console.log(this.districts,"saasas")
})

}
getAnnexes(e){
  this.rnpService.getResourceAll2('annexes/search/findAnnexesByDistrictId?districtId='+e).subscribe(data=>{
    this.annexes = data['_embedded'].annexes
    console.log(this.annexes,"saasas")
})


}
}


