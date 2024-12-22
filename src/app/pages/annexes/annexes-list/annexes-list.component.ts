import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { number } from 'echarts';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-annexes-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './annexes-list.component.html',
  styleUrl: './annexes-list.component.scss'
})
export class AnnexesListComponent {

  size:number = 5;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  annexes
  selectedDistrict:any = ""
  districts
  districtSelected = false
  selectedE
  totalCount
  districtName: string;
  districtForhtml: string;
  constructor(private rnpService: restApiService,private router: Router,private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getAnnexes(this.currentPage)
    this.getDistricts()
}
getDistricts(){
  this.rnpService.getResourceAll('districts').subscribe(data=>{
    this.districts = data['_embedded'].districts
})

}
getAnnexes(page){
 this.setTotalCount()
 this.rnpService.getResource("annexes",page,this.size).subscribe(data=>{
  this.annexes = data['_embedded'].annexes
  console.log(data,"rorfo")
  console.log(this.annexes,"szszsz")
  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
setTotalCount(){
 
  this.rnpService.getResourceAll('annexes').subscribe(data=>{
    let annexes = data['_embedded'].annexes
   
    if(annexes){
    this.totalCount = annexes.length

  }
})
}
addResource(){
  this.router.navigateByUrl("annexes/add")

}
getDataWIthFiltersForTotalCount(){
  let d;

  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  
    let url = `${this.rnpService.host}/annexes/search/findAnnexesByDistrictId2?`;

  if (d !== undefined) {
    url += `districtId=${d}`;
  }
  
 
    

  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let annexes = data['_embedded'].annexes
       console.log(annexes,'kxxxxfktgtgj')
      
       if(annexes){
       this.totalCount = annexes.length
       console.log(this.totalCount,'kfktgtgj')
      
      }
      },
      err => {
       console.log(err);
      }
      );
      
}

getDataWIthFiltersAndPageAndSize(){

  let d;
 
  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  
    let url = `${this.rnpService.host}/annexes/search/findAnnexesByDistrictId?`;

 if (d !== undefined) {
   url += `districtId=${d}`;
 }
 
  
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.annexes = data['_embedded'].annexes;
  
   console.log(data,"szszeedrr")
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);

  },
  err => {
   console.log(err);
  }
  );
}
onDistrictClicked(e, page = 0) {
  // this.getAnnexes(e)
  if(e!=0){
    this.rnpService.getOneResourceById("districts",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.districtForhtml = data.designation
    
      this.districtForhtml =  ' التابعة ل: '+ this.districtForhtml

    })
  }else{
    this.districtName = ""
     this.districtForhtml = ""
  
  }
   this.setTotalCountForDistrictSelected(e)
 
  this.selectedDistrict = e;
  this.districtSelected =true
  this.currentPage = page;
   this.getDataWIthFiltersAndPageAndSize()
 
  
 }
 setTotalCountForDistrictSelected(e){

  this.selectedDistrict = e;
  
  this.districtSelected = true;
  
 this.getDataWIthFiltersForTotalCount()

 
 
}
onPageClicked(i:number){

  
  
    this.currentPage = i;
  
  if(this.districtSelected==false)
  {this.getAnnexes(i)
    console.log("rfrfrfrf")
  }
  else{

    if(this.districtSelected ==true){
      this.onDistrictClicked(this.selectedDistrict,this.currentPage)
      console.log("districtt")
    }
  
  
  }
  
  }

  onSelectedSize(e){
    this.size = e.target.value
    this.getDisplayRange()
    
    
    // this.getUsers(0) 

      if(this.districtSelected==false)
      {this.getAnnexes(0)
      }
      else{
    
        if(this.districtSelected ==true){
          this.onDistrictClicked(this.selectedDistrict,0)
          console.log("districtt")
        }
        
      }
    }
    

    getDisplayRange(): string {
      console.log('size',this.size)
      console.log('cureet page ',this.currentPage)
      console.log('Total count ',this.totalCount)
      let startEntry = ((Number(this.currentPage) - 1) * Number(this.size) + 1)+Number(this.size);
      let start = startEntry+this.size
      console.log(startEntry,"ssssssssssssssss")
      console.log(this.size,"size")
       let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
     console.log((Number(this.currentPage) * Number(this.size))+Number(this.size),'mmmmmmmmmmmmmm')
      if (this.annexes?.length==0) {
        return `No entries to display`;
    }
    
      return ` إظهار ${Number(startEntry)} إلى ${Number(endEntry)} من أصل   ${Number(this.totalCount)}`;
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
  


  onDeleteResource(url:string){
    if(this.getConnectedUserRole()!='USER-AAL'){
      Swal.fire({
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
      }).then(result => {
       
        if (result.value) {
          this.rnpService.deleteResource('annexes',url).subscribe(data=>{
           this.onPageClicked(0)
           this.currentPage = 0
             },err=>{
               console.log(err)
             })
          Swal.fire({text:'لقد تم حذف الملحقة', confirmButtonColor: '#364574',   customClass:{
            title: 'kuffi',
            confirmButton: 'kuffi',
            container: 'kuffi'
          }, icon: 'success',});
        }
      });
       
    }

    }
    onEditResource(p:any){
     
      let url = p['_links'].self.href;
      this.router.navigateByUrl("annexes/edit/"+btoa(url))
    } 
    getConnectedUserRole(){
      if(this.authService.loadToken()){
        return JSON.parse(atob(this.authService.loadToken().split('.')[1])).roles[0].authority
      }
     }
}

