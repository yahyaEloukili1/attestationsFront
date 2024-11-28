import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import {  } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-citoyens-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './citoyens-list.component.html',
  styleUrl: './citoyens-list.component.scss'
})
export class CitoyensListComponent {
  cin
  size:number = 8
  currentPage:number = 0;
  totalPages: number;
  pages: Array<number>
  selected: boolean
  citoyens
  selectedDistrict:any = ""
  selectedAppRole:any = ""

  appRoles
  districts
  role = 0
  ruee
  
  annexes
  roleSelected = false
  annexeSelected = false
  quartierSelected = false
  rueSelected = false
  ruelleSelected = false
  sexSelected = false
  situationSeletd = false
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
  ruellee
  selectedPachalik:any = ""
  d
  a
  roleName
  annexeName: any;
  pachalikName: any;
  districtName: string;
  citoyensToPrint: any;
  pachalikForhtml
  districForHtml: string;
  annexeForHtml: string;
  selectedQuartier: any = "";
  selectedRue: any = "";
  selectedRuelle: any = "";
  selectedSex: any = "";
  selectedSituation: any = "";
  rueName: string;
  ruelleForHtml: string;
  rueForHtml: string;
  ruelleName: string;
  showrRuelle: boolean;
  showRuelle: boolean;
  quartierName: any;
  quartierForhtml: string;
  rues: any;
  showRue: boolean;
  qartiers: any;
  ruelles: any;
  quartiers: any;
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
    this.getUsers(this.currentPage)
    this.getResourcesForDropDownList()
}
setTotalCount(){
  console.log('00000000000')
  this.rnpService.getResourceAll('citoyens').subscribe(data=>{
    let citoyens = data['_embedded'].citoyens
    this.citoyensToPrint = citoyens
    if(citoyens){
    this.totalCount = citoyens.length
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
  let a,d,p,q,rue,ruelle,sex,situation;
  a= this.selectedAnnexe == 0 || this.selectedAnnexe == "" ? undefined : this.selectedAnnexe;
  p= this.selectedPachalik == 0 || this.selectedPachalik == ""? undefined : this.selectedPachalik;
  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  q = this.selectedQuartier == 0 || this.selectedQuartier == ""? undefined : this.selectedQuartier;
  rue = this.selectedRue == 0 || this.selectedRue == ""? undefined : this.selectedRue;
  ruelle = this.selectedRuelle == 0 || this.selectedRuelle == ""? undefined : this.selectedRuelle;
  sex = this.selectedSex == 0 || this.selectedSex == ""? undefined : this.selectedSex;
  situation = this.selectedSituation == 0 || this.selectedSituation == ""? undefined : this.selectedSituation;
   
    let url = `${this.rnpService.host}/citoyens/search/findByPachalikIdAndDistrictIdAndAnnexeIdAndQuartierIdAndRueIdAndRuelleIdAndSexIdAndSituationId2?`;
  
  
     if (p !== undefined) {
      url += `pachalikId=${p}`;
  }
  if (d !== undefined) {
    url += `&districtId=${d}`;
  }
  
     if (a !== undefined) {
       url += `&annexeId=${a}`;
     }
     if (q !== undefined) {
      url += `&quartierId=${q}`;
    }
    if (rue !== undefined) {
      url += `&rueId=${rue}`;
    }
    if (ruelle !== undefined) {
      url += `&ruelleId=${ruelle}`;
    }
    if (sex !== undefined) {
      if(p==undefined && d==undefined&&a==undefined && q==undefined && rue==undefined && ruelle==undefined )
        url += `sexId=${sex}`;
      else{
        url += `&sexId=${sex}`;
      }
    }
    if (situation !== undefined) {
      url += `&situationId=${situation}`;
    }
    

  
  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let citoyens = data['_embedded'].citoyens
       this.citoyensToPrint = citoyens
       if(citoyens){
       this.totalCount = citoyens.length
       console.log(citoyens,'lllszszszzddd')
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
setTotalCountForQuartierSelected(e){
  this.cin = ""
  this.selectedQuartier = e;
  
  this.quartierSelected = true;
  this.selectedRue = ""
  this.selectedRuelle = ""
 this.logique(e)
   

 
 
}
setTotalCountForDistrictSelected(e){
  this.cin = ""
  this.selectedDistrict = e;
  
  this.districtSelected = true;
  this.selectedAnnexe = ""
 this.logique(e)

 
 
}
setTotalCountForSexSelected(e){
  this.cin = ""
  this.selectedSex =e;
  
  this.sexSelected = true;

 this.logique(e)

 
 
}
setTotalCountForSituationSelected(e){
  this.cin = ""
  this.selectedSituation =e;
  
  this.situationSeletd = true;

 this.logique(e)

 
 
}
setTotalCountForRueSelected(e){
  this.cin = ""
  this.selectedRue = e;
  
  this.rueSelected = true;
  this.selectedRuelle = ""
 this.logique(e)

 
 
}
setTotalCountForAnnexeSelected(e){
  this.cin = ""
  this.selectedAnnexe = e;
  
  this.annexeSelected = true;

this.logique(e)
   

 
 
}
setTotalCountForRuelleSelected(e){
  this.cin = ""
  this.selectedRuelle = e;
  
  this.ruelleSelected = true;

this.logique(e)
   

 
 
}
setTotalCountForCinSelected(){
  this.cinSelected = true
  this.currentPage = 0
  if(this.cin=="" || this.cin==undefined || this.cin==null){
this.getUsers2(0)
  }else{

  let url = `${this.rnpService.host}/citoyens/search/findByCin2?cin=`;
  this.rnpService.getOneResource(url+this.cin).subscribe(data=>{
  let citoyens = data['_embedded'].citoyens;
  this.citoyensToPrint = citoyens
  this.totalCount = citoyens.length
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
  if(this.pachalikSelected ==true && this.districtSelected ==false && this.annexeSelected==false && this.quartierSelected ==false
    && this.rueSelected==false && this.ruelleSelected ==false && this.sexSelected ==false && this.situationSeletd ==false
   ){
  //  this.onRoleClicked(this.selectedRole,this.currentPage)
    this.onPachalikClicked(this.selectedPachalik,this.currentPage)
  }
  if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==false && this.quartierSelected ==false
    && this.rueSelected==false && this.ruelleSelected ==false && this.sexSelected ==false && this.situationSeletd ==false
   ){
  //  this.onRoleClicked(this.selectedRole,this.currentPage)
    this.onDistrictClicked(this.selectedDistrict,this.currentPage)
  }
  if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true && this.quartierSelected ==false
    && this.rueSelected==false && this.ruelleSelected ==false && this.sexSelected ==false && this.situationSeletd ==false
   ){
  //  this.onRoleClicked(this.selectedRole,this.currentPage)
    this.onAnnexeClicked(this.selectedDistrict,this.currentPage)
  }
  if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true && this.quartierSelected ==true
    && this.rueSelected==false && this.ruelleSelected ==false && this.sexSelected ==false && this.situationSeletd ==false
   ){
  //  this.onRoleClicked(this.selectedRole,this.currentPage)
    this.onQuartierClicked(this.selectedQuartier,this.currentPage)
  }
  if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true && this.quartierSelected ==true
    && this.rueSelected==true && this.ruelleSelected ==false && this.sexSelected ==false && this.situationSeletd ==false
   ){
  //  this.onRoleClicked(this.selectedRole,this.currentPage)
    this.onRueClicked(this.selectedRue,this.currentPage)
  }
  if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true && this.quartierSelected ==true
    && this.rueSelected==true && this.ruelleSelected ==true && this.sexSelected ==false && this.situationSeletd ==false
   ){
  //  this.onRoleClicked(this.selectedRole,this.currentPage)
    this.onRuelleClicked(this.selectedRuelle,this.currentPage)
  }
  // if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true && this.quartierSelected ==true
  //   && this.rueSelected==true && this.ruelleSelected ==true && this.sexSelected ==true && this.situationSeletd ==false
  //  ){
  // //  this.onRoleClicked(this.selectedRole,this.currentPage)
  //   this.onSexClicked(this.selectedRuelle,this.currentPage)
  // }
  // if(this.pachalikSelected ==true && this.districtSelected ==true && this.annexeSelected==true && this.quartierSelected ==true
  //   && this.rueSelected==true && this.ruelleSelected ==true && this.sexSelected ==true && this.situationSeletd ==true
  //  ){
  // //  this.onRoleClicked(this.selectedRole,this.currentPage)
  //   this.onSituationClicked(this.selectedRuelle,this.currentPage)
  // }

}
}
}
getUsers(page){
  this.cinSelected = false
 this.setTotalCount()
 this.rnpService.getResource("citoyens",page,this.size).subscribe(data=>{
  this.citoyens = data['_embedded'].citoyens
  console.log(this.citoyens,"szszsz")
  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
getUsers2(page){
this.setTotalCount()
this.rnpService.getResource("citoyens",page,this.size).subscribe(data=>{
  this.citoyens = data['_embedded'].citoyens
  console.log(data,'vvvvv')
 this.totalPages = data['page'].totalPages
 this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}

onDetailResource(p){
  let url = `${this.rnpService.host}/citoyens/${p.id}`;
  this.router.navigateByUrl("users/detail/"+btoa(url))
}






// onRoleClicked(e, page = 0) {
//   console.log(e,'sqqsq')
//   if(e!=0){
//     this.setTotalCountForRoleSelected(e)
//     this.rnpService.getOneResourceById("appRoles",e).subscribe(data=>{
//       console.log(data.roleNameAr,"jhjjhjhh")
//       this.roleName = data.roleNameAr
//       this.roleName =  ' ذوي الحالة العائلية: '+ this.roleName
//       this.pachalikForhtml = ""
//       this.pachalikName = ""
//       this.districtName = ""
//       this.annexeName = ""
//       this.annexeForHtml = ""
//     })
//   }else{
//     this.roleName = ""
//     this.pachalikName = ""
//     this.pachalikForhtml= ""
//     this.districtName = ""
//     this.districForHtml = ""
//     this.annexeName = ""
//     this.annexeForHtml = ""
//     this.setTotalCount()
//   }

//   this.cin = ""
//   this.cinSelected = false
//   if(e==3){
//     this.showPachalik = true
//   }
//   else{
//     this.showPachalik = false
//     this.showAnnexe = false
//     this.showDistrict = false
    
//   }

//  this.roleSelected = true;
//  this.pachalikSelected = false
//  this.districtSelected = false
//  this.annexeSelected = false
//  this.selectedRole = e;
//  this.selectedPachalik =""
//  this.selectedDistrict = ""
//  this.selectedAnnexe = ""
//  this.currentPage = page;
// this.logique2()



 
// }

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
 onRuelleClicked(e, page = 0) {
  this.setTotalCountForRuelleSelected(e)
  this.cin = ""
  if(e!=0){
    this.rnpService.getOneResourceById("ruelles",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.ruelleName = data.designation
      this.ruelleForHtml =  ', '+this.ruelleName 
    })
  }else{
    this.ruelleName = ""
    this.ruelleForHtml = ""
  }
  this.selectedRuelle = e;
  this.roleSelected = true;
  this.ruelleSelected =  true
  this.quartierSelected = true
  this.rueSelected = true
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
 onQuartierClicked(e, page = 0) {
  this.selectedQuartier = e;
  if(e!=0){
    this.rnpService.getOneResourceById("quartiers",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.quartierName = data.designation
      this.quartierForhtml =  ', التابعين ل: '+ this.quartierName
      this.rueName = ""
      this.districForHtml = ""
      this.ruelleName= ""
      this.ruelleForHtml = ""
    })
  }else if(e==0){
    this.quartierName = ""
    this.quartierForhtml = ""
    this.districForHtml = ""
    this.ruelleForHtml = ""
this.rueName = ""
this.ruelleName = ""
  }
  this.getRues(e)
  this.setTotalCountForQuartierSelected(e)
  this.cin = ""
  if(e==0){
   this.showRue = false
   this.showRuelle = false
  }
  else{
    // this.d= ''
    this.showRue =true
    this.showRuelle = false
  }
 
 
 
  

  this.quartierSelected =  true
  this.rueSelected = false
  this.ruelleSelected = false
  this.selectedRuelle =undefined

  this.selectedRue = ""
  this.currentPage = page;

 
 this.logique2()
 
  
 }
 

 onSituationClicked(e, page = 0) {
  console.log(e,'situation clicked')
  this.setTotalCountForSituationSelected(e)
  this.cin = ""
  if(e!=0){
    // this.rnpService.getOneResourceById("ruelles",e).subscribe(data=>{
    //   console.log(data.designation,"jhjjhjhh")
    //   this.ruelleName = data.designation
    //   this.ruelleForHtml =  ', '+this.ruelleName 
    // })
  }else{
    // this.ruelleName = ""
    // this.ruelleForHtml = ""
  }
  // this.selectedRuelle = e;
  // this.roleSelected = true;
  // this.ruelleSelected =  true
  // this.quartierSelected = true
  // this.rueSelected = true
  // this.currentPage = page;
 this.logique2()
 
  
 }
 onSexClicked(e, page = 0) {
  this.setTotalCountForSexSelected(e)
  this.cin = ""
  if(e!=0){
    // this.rnpService.getOneResourceById("ruelles",e).subscribe(data=>{
    //   console.log(data.designation,"jhjjhjhh")
    //   this.ruelleName = data.designation
    //   this.ruelleForHtml =  ', '+this.ruelleName 
    // })
  }else{
    // this.ruelleName = ""
    // this.ruelleForHtml = ""
  }
  // this.selectedRuelle = e;
  // this.roleSelected = true;
  // this.ruelleSelected =  true
  // this.quartierSelected = true
  // this.rueSelected = true
  // this.currentPage = page;
 this.logique2()
 
  
 }
logique2(){

  let a,d,p,q,rue,ruelle,sex,situation;
  a= this.selectedAnnexe == 0 || this.selectedAnnexe == "" ? undefined : this.selectedAnnexe;
  p= this.selectedPachalik == 0 || this.selectedPachalik == ""? undefined : this.selectedPachalik;
  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  q = this.selectedQuartier == 0 || this.selectedQuartier == ""? undefined : this.selectedQuartier;
  rue = this.selectedRue == 0 || this.selectedRue == ""? undefined : this.selectedRue;
  ruelle = this.selectedRuelle == 0 || this.selectedRuelle == ""? undefined : this.selectedRuelle;
  sex = this.selectedSex == 0 || this.selectedSex == ""? undefined : this.selectedSex;
  situation = this.selectedSituation == 0 || this.selectedSituation == ""? undefined : this.selectedSituation;
    let url = `${this.rnpService.host}/citoyens/search/findByPachalikIdAndDistrictIdAndAnnexeIdAndQuartierIdAndRueIdAndRuelleIdAndSexIdAndSituationId?`;

  
  
     if (p !== undefined) {
      url += `pachalikId=${p}`;
  }
  if (d !== undefined) {
    url += `&districtId=${d}`;
  }
  
     if (a !== undefined) {
       url += `&annexeId=${a}`;
     }
     if (q !== undefined) {
      url += `&quartierId=${q}`;
    }
    if (rue !== undefined) {
      url += `&rueId=${rue}`;
    }
    if (ruelle !== undefined) {
      url += `&ruelleId=${ruelle}`;
    }
    if (sex !== undefined) {
      if(p==undefined && d==undefined&&a==undefined && q==undefined && rue==undefined && ruelle==undefined )
        url += `sexId=${sex}`;
      else{
        url += `&sexId=${sex}`;
      }
    }
    if (situation !== undefined) {
      if(p==undefined && d==undefined&&a==undefined && q==undefined && rue==undefined && ruelle==undefined )
        url += `situationId=${situation}`;
      else{
        url += `&situationId=${situation}`;
      }
    }
    
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.citoyens = data['_embedded'].citoyens;
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);
    console.log(this.citoyens,'xwx')
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
 this.rnpService.uploadFileWithData(this.roleName,this.pachalikName,this.districtName,this.annexeName,this.citoyensToPrint)
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


 onRueClicked(e, page = 0) {
  this.getRuelles(e)
  if(e!=0){
    this.rnpService.getOneResourceById("rues",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.rueName = data.designation
      this.ruelleName = ""
      this.ruelleForHtml = ""
      this.rueForHtml    = ', ' + this.rueName 
    })
  }else{
    this.rueName = ""
    this.rueName = ""
    this.ruelleForHtml = ""
    this.ruelleForHtml = ""
  }
  this.setTotalCountForRueSelected(e)
  this.cin = ""
  this.selectedRue = e;
  if(e==0){
    this.showRuelle = false
    console.log("show annexe")
  }else{
    this.ruellee= ''
    this.showRuelle = true
  }
  this.selectedRuelle = ""
  this.rueSelected =true
  this.quartierSelected = true
  this.ruelleSelected =false
  this.currentPage = page;
 this.logique2()
 
  
 }



























































 
 searchUser2(i){
  this.cinSelected = true
  console.log("search user")
  if(this.cinSelected){
    this.roleName = this.cin + ' :رقم البطاقة الوطنية '
  }
  this.rnpService.getResourceByKeyword("citoyens",i,this.size,this.cin,"Cin").subscribe(data=>{
    this.citoyens = data['_embedded'].citoyens;
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

  
  this.rnpService.getResourceByKeyword("citoyens",0,this.size,this.cin,"Cin").subscribe(data=>{
    this.citoyens = data['_embedded'].citoyens;
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
       // this.onRoleClicked(this.selectedRole,0)
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
  this.getQuartiers()
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
    this.router.navigateByUrl("citoyens/add")

}
onDeleteResource(p){
  this.modelWarning().then(result => {
      if (result.value) {
        if(this.districtSelected==false){
          let url = p['_links'].self.href
          this.rnpService.deleteResource('citoyens',url).subscribe(data=>{
           
            this.modelSuccess('لقد تم حذف الملحقة')
      
             },err=>{
              this.modelError('لا يمكن حدف الملحقة')
          
             })
        }else{
          
          this.rnpService.deleteResource('citoyens',`${this.rnpService.host}/citoyens/${p.id}`).subscribe(data=>{
           
            this.modelSuccess('لقد تم حذف الملحقة')
             },err=>{
              this.modelError('لا يمكن حدف الملحقة')
             })
        
        }
    
      
      }
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
    let url = `${this.rnpService.host}/citoyens/${p.id}`;
     this.router.navigateByUrl("attestations/edit/"+btoa(url))
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
  if (this.citoyens?.length==0) {
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
getQuartiers(){
  this.rnpService.getResourceAll('quartiers').subscribe(data=>{
    this.quartiers = data['_embedded'].quartiers
})

}


getRues(e){
  console.log(e,"dsdsdsdsd")
  this.rnpService.getResourceAll2('rues/search/findRuesByQuartierId?quartierId='+e).subscribe(data=>{
    this.rues = data['_embedded'].rues
    console.log(this.rues,"pkpk")
})

}
getRuelles(e){
  this.rnpService.getResourceAll2('ruelles/search/findRuellesByRueId?rueId='+e).subscribe(data=>{
    this.ruelles = data['_embedded'].ruelles
    console.log(this.ruelles,"wqwqqw")
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


