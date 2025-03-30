import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zanqa-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './zanqa-list.component.html',
  styleUrl: './zanqa-list.component.scss'
})
export class ZanqaListComponent {

  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  ruelles
  selectedrue:any = ""
  rues
  rueselected = false
  selectedE
  totalCount
  rueName: string;
  rueForhtml: string;
  constructor(private rnpService: restApiService,private router: Router,private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getruelles(this.currentPage)
    this.getrues()
}
getrues(){
  this.rnpService.getResourceAll('rues').subscribe(data=>{
    this.rues = data['_embedded'].rues
})

}
getruelles(page){
 this.setTotalCount()
 this.rnpService.getResource("ruelles",page,this.size).subscribe(data=>{
  this.ruelles = data['_embedded'].ruelles

  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
 
 })
}
setTotalCount(){
 
  this.rnpService.getResourceAll('ruelles').subscribe(data=>{
    let ruelles = data['_embedded'].ruelles
   
    if(ruelles){
    this.totalCount = ruelles.length

  }
})
}
addResource(){
  this.router.navigateByUrl("ruelles/add")

}
getDataWIthFiltersForTotalCount(){
  let d;

  d= this.selectedrue == 0 || this.selectedrue == ""? undefined : this.selectedrue;
  
    let url = `${this.rnpService.host}/ruelles/search/findRuellesByRueId2?`;

  if (d !== undefined) {
    url += `rueId=${d}`;
  }
  
 
    

  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let ruelles = data['_embedded'].ruelles
     
      
       if(ruelles){
       this.totalCount = ruelles.length
   
      
      }
      },
      err => {
    
      }
      );
      
}

getDataWIthFiltersAndPageAndSize(){

  let d;
 
  d= this.selectedrue == 0 || this.selectedrue == ""? undefined : this.selectedrue;
  
    let url = `${this.rnpService.host}/ruelles/search/findRuellesByRueId?`;

 if (d !== undefined) {
   url += `rueId=${d}`;
 }
  
    url+=`&page=${this.currentPage}&size=${this.size}`
   
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.ruelles = data['_embedded'].ruelles;
  
  
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);

  },
  err => {

  }
  );
}
onrueClicked(e, page = 0) {
console.log("efded");
  // this.getruelles(e)
  if(e!=0){
    this.rnpService.getOneResourceById("rues",e).subscribe(data=>{
      
      this.rueForhtml = data.designation
    
      this.rueForhtml =  ', التابعين ل: '+ this.rueForhtml

    })
  }else{
    this.rueName = ""
     this.rueForhtml = ""
  
  }
   this.setTotalCountForrueselected(e)
 
  this.selectedrue = e;
  this.rueselected =true
  this.currentPage = page;
   this.getDataWIthFiltersAndPageAndSize()
 
  
 }
 setTotalCountForrueselected(e){

  this.selectedrue = e;
  
  this.rueselected = true;
  
 this.getDataWIthFiltersForTotalCount()

 
 
}
onPageClicked(i:number){


  
    this.currentPage = i;
  
  if(this.rueselected==false)
  {this.getruelles(i)
  
  }
  else{

    if(this.rueselected ==true){
      this.onrueClicked(this.selectedrue,this.currentPage)
    
    }
  
  
  }
  
  }

  onSelectedSize(e){
    this.size = e.target.value
    this.getDisplayRange()
   
    
    // this.getUsers(0) 

      if(this.rueselected==false)
      {this.getruelles(0)
      }
      else{
    
        if(this.rueselected ==true){
          this.onrueClicked(this.selectedrue,0)
        
        }
        
      }
    }
    

    getDisplayRange(): string {
    
      let startEntry = ((Number(this.currentPage) - 1) * Number(this.size) + 1)+Number(this.size);
      let start = startEntry+this.size
    
       let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
   
      if (this.ruelles?.length==0) {
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
          this.rnpService.deleteResource('ruelles',url).subscribe(data=>{
           this.onPageClicked(0)
           this.currentPage = 0
             },err=>{
               console.log(err)
             })
          Swal.fire({text:'لقد تم حذف الزنقة', confirmButtonColor: '#364574',   customClass:{
            title: 'kuffi',
            confirmButton: 'kuffi',
            container: 'kuffi'
          }, icon: 'success',});
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
      this.router.navigateByUrl("ruelles/edit/"+btoa(url))
    } 
    getConnectedUserRole(){
      if(this.authService.loadToken()){
        return JSON.parse(atob(this.authService.loadToken().split('.')[1])).roles[0].authority
      }
     }
}

