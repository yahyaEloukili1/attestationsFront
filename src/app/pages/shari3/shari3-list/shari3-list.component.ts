import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-shari3-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './shari3-list.component.html',
  styleUrl: './shari3-list.component.scss'
})
export class Shari3ListComponent {

  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  rues
  selectedquartier:any = ""
  quartiers
  quartierselected = false
  selectedE
  totalCount
  quartierName: string;
  quartierForhtml: string;
  constructor(private rnpService: restApiService,private router: Router,private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getrues(this.currentPage)
    this.getquartiers()
}
getquartiers(){
  this.rnpService.getResourceAll('quartiers').subscribe(data=>{
    this.quartiers = data['_embedded'].quartiers
})

}
getrues(page){
 this.setTotalCount()
 this.rnpService.getResource("rues",page,this.size).subscribe(data=>{
  this.rues = data['_embedded'].rues
  console.log(data,"rorfo")
  console.log(this.rues,"szszsz")
  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
setTotalCount(){
 
  this.rnpService.getResourceAll('rues').subscribe(data=>{
    let rues = data['_embedded'].rues
   
    if(rues){
    this.totalCount = rues.length

  }
})
}
addResource(){
  this.router.navigateByUrl("rues/add")

}
getDataWIthFiltersForTotalCount(){
  let d;

  d= this.selectedquartier == 0 || this.selectedquartier == ""? undefined : this.selectedquartier;
  
    let url = `${this.rnpService.host}/rues/search/findRuesByquartierId2?`;

  if (d !== undefined) {
    url += `quartierId=${d}`;
  }
  
 
    

  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let rues = data['_embedded'].rues
       console.log(rues,'kxxxxfktgtgj')
      
       if(rues){
       this.totalCount = rues.length
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
 
  d= this.selectedquartier == 0 || this.selectedquartier == ""? undefined : this.selectedquartier;
  
    let url = `${this.rnpService.host}/rues/search/findRuesByQuartierId?`;

 if (d !== undefined) {
   url += `quartierId=${d}`;
 }
 
  
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.rues = data['_embedded'].rues;
  
   console.log(data,"szszeedrr")
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);

  },
  err => {
   console.log(err);
  }
  );
}
onquartierClicked(e, page = 0) {
  // this.getrues(e)
  if(e!=0){
    this.rnpService.getOneResourceById("quartiers",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.quartierForhtml = data.designation
    
      this.quartierForhtml =  ', التابعين ل: '+ this.quartierForhtml

    })
  }else{
    this.quartierName = ""
     this.quartierForhtml = ""
  
  }
   this.setTotalCountForquartierselected(e)
 
  this.selectedquartier = e;
  this.quartierselected =true
  this.currentPage = page;
   this.getDataWIthFiltersAndPageAndSize()
 
  
 }
 setTotalCountForquartierselected(e){

  this.selectedquartier = e;
  
  this.quartierselected = true;
  
 this.getDataWIthFiltersForTotalCount()

 
 
}
onPageClicked(i:number){

  console.log(this.quartierselected,'quartier selected')
  
    this.currentPage = i;
  
  if(this.quartierselected==false)
  {this.getrues(i)
    console.log("rfrfrfrf")
  }
  else{

    if(this.quartierselected ==true){
      this.onquartierClicked(this.selectedquartier,this.currentPage)
      console.log("quartiert")
    }
  
  
  }
  
  }

  onSelectedSize(e){
    this.size = e.target.value
    this.getDisplayRange()
  
    
    // this.getUsers(0) 

      if(this.quartierselected==false)
      {this.getrues(0)
      }
      else{
    
        if(this.quartierselected ==true){
          this.onquartierClicked(this.selectedquartier,0)
          console.log("quartiert")
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
      if (this.rues?.length==0) {
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
              this.modelSuccess('لقد تم حذف الشارع '); // Success feedback
            },
            error: (err) => {
              console.log(err,"eded");
              if(err!.error!.cause!.cause!.message.includes('Cannot delete or update a parent row: a foreign')){
                this.modelError("لا يمكن حذف الشارع  لأنه مرتبط بزنقة مضافة")
              }else{
                this.modelError('حدث خطأ أثناء حذف الشارع . يرجى المحاولة مرة أخرى.'); // Display error feedback
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
      this.router.navigateByUrl("rues/edit/"+btoa(url))
    } 
    getConnectedUserRole(){
      if(this.authService.loadToken()){
        return JSON.parse(atob(this.authService.loadToken().split('.')[1])).roles[0].authority
      }
     }
}

