import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-hay-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hay-list.component.html',
  styleUrl: './hay-list.component.scss'
})
export class HayListComponent {
 
  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  quartiers
  selectedDistrict:any = ""
  districts
  districtSelected = false
  selectedE
  totalCount
  districtName: string;
  districtForhtml: string;
  designation
  constructor(private rnpService: restApiService,private router: Router,private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getquartiers(this.currentPage)
 
}


getquartiers(page){
 this.setTotalCount()
 this.rnpService.getResource("quartiers",page,this.size).subscribe(data=>{
  this.quartiers = data['_embedded'].quartiers
  console.log(data,"rorfo")
  console.log(this.quartiers,"szszsz")
  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
setTotalCount(){
 
  this.rnpService.getResourceAll('quartiers').subscribe(data=>{
    let quartiers = data['_embedded'].quartiers
   
    if(quartiers){
    this.totalCount = quartiers.length

  }
})
}
addResource(){
  this.router.navigateByUrl("quartiers/add")

}
getDataWIthFiltersForTotalCount(){

  
    let url = `${this.rnpService.host}/quartiers/search/findByDesignationFrContainsIgnoreCase?`;

  // if (d !== undefined) {
    url += `designationFr=${this.designation}`;
  // }
  
 
    

  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let quartiers = data['_embedded'].quartiers
       console.log(quartiers,'kxxxxfktgtgj')
      
       if(quartiers){
       this.totalCount = quartiers.length
       console.log(this.totalCount,'kfktgtgj')
      
      }
      },
      err => {
       console.log(err);
      }
      );
      
}

getDataWIthFiltersAndPageAndSize(){

 
 

  
    let url = `${this.rnpService.host}/quartiers/search/findByDesignationFr?`;

//  if (d !== undefined) {
   url += `designationFr=${this.designation}`;
//  }
 
  
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.quartiers = data['_embedded'].quartiers;
  
   console.log(data,"szszeedrr")
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);

  },
  err => {
   console.log(err);
  }
  );
}
searchByDesignation(page = 0) {

  
  if(this.designation!="" && this.designation!=undefined){
   
    
      this.districtForhtml =  'بإسم '+ this.designation


  }else{
    this.districtName = ""
     this.districtForhtml = ""
  
  }
   this.setTotalCountForDesignationSelected()
 
   this.selectedDistrict = this.designation;
  this.districtSelected =true
  this.currentPage = page;
  if(this.designation!="" && this.designation!=undefined){
    this.getDataWIthFiltersAndPageAndSize()
  }else{
    this.getquartiers(this.currentPage)
    console.log("edededzézzs")
  }
  
 
  
 }
 setTotalCountForDesignationSelected(){

  this.selectedDistrict = this.designation;
  
  this.districtSelected = true;
  
 this.getDataWIthFiltersForTotalCount()

 
 
}
onPageClicked(i:number){

  console.log(this.districtSelected,'district selected')
  
    this.currentPage = i;
  
  if(this.districtSelected==false)
  {this.getquartiers(i)
    console.log("rfrfrfrf")
  }
  else{

    if(this.districtSelected ==true){
      this.searchByDesignation(this.currentPage)
      console.log("districtt")
    }
  
  
  }
  
  }

  onSelectedSize(e){
    this.size = e.target.value
    this.getDisplayRange()
  
    
    // this.getUsers(0) 

      if(this.districtSelected==false)
      {this.getquartiers(0)
      }
      else{
    
        if(this.districtSelected ==true){
          this.searchByDesignation(0)
    
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
      if (this.quartiers?.length==0) {
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
      this.modelWarning().then((result) => {
        if (result.value) {
          this.rnpService.deleteResource('agentAutorites', url).subscribe({
            next: (data) => {
              this.onPageClicked(0); // Refresh the page data
              this.currentPage = 0; // Reset the current page
              this.modelSuccess('لقد تم حذف  الحي'); // Success feedback
            },
            error: (err) => {
              console.log(err,"eded");
              if(err!.error!.cause!.cause!.message.includes('Cannot delete or update a parent row: a foreign')){
                this.modelError("لا يمكن حذف الحي لأنه   مرتبط بشارع مضاف")
              }else{
                this.modelError('حدث خطأ أثناء حذف الحي . يرجى المحاولة مرة أخرى.'); // Display error feedback
              }
            
            },
          });
        }
      });
     
       
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
     
      let url = p['_links'].self.href;
      this.router.navigateByUrl("quartiers/edit/"+btoa(url))
    } 
    getConnectedUserRole(){
      if(this.authService.loadToken()){
        return JSON.parse(atob(this.authService.loadToken().split('.')[1])).roles[0].authority
      }
     }
}

