import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent {

  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  agentAutorites
  selectedannexe:any = ""
  annexes
  annexeselected = false
  selectedE
  totalCount
  annexeName: string;
  annexeForhtml: string;
  annexeOfUserConnected: any;
  annexeIdOfUserConnected: any;
  annexeNameOfUserConnected: any;
  constructor(private rnpService: restApiService,private router: Router,private authService: AuthenticationService) { }

  ngOnInit(): void {
    if(this.getConnectedUserRole()!="USER-AAL"){
      this.getagentAutorites(this.currentPage)
    }
   
    this.getannexes()
    this.getConnectedUserAnnexeAndAnnexeNameOfUSerAalConnected()
}
getannexes(){
  this.rnpService.getResourceAll('annexes').subscribe(data=>{
    this.annexes = data['_embedded'].annexes
})

}
getagentAutorites(page){
 this.setTotalCount()
 this.rnpService.getResource("agentAutorites",page,this.size).subscribe(data=>{
  this.agentAutorites = data['_embedded'].agentAutorites

  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
setTotalCount(){
 
  this.rnpService.getResourceAll('agentAutorites').subscribe(data=>{
    let agentAutorites = data['_embedded'].agentAutorites
   
    if(agentAutorites){
    this.totalCount = agentAutorites.length

  }
})

}
addResource(){
  this.router.navigateByUrl("agents/add")

}
getDataWIthFiltersForTotalCount(){
  let d;

  d= this.selectedannexe == 0 || this.selectedannexe == ""? undefined : this.selectedannexe;
  
    let url = `${this.rnpService.host}/agentAutorites/search/findAgentAutoritesByAnnexeId2?`;

  if (d !== undefined) {
    url += `annexeId=${d}`;
  }
  
 
    

  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let agentAutorites = data['_embedded'].agentAutorites
       console.log(agentAutorites,'kxxxxfktgtgj')
      
       if(agentAutorites){
       this.totalCount = agentAutorites.length
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
 
  d= this.selectedannexe == 0 || this.selectedannexe == ""? undefined : this.selectedannexe;
  
    let url = `${this.rnpService.host}/agentAutorites/search/findAgentAutoritesByAnnexeId?`;

 if (d !== undefined) {
   url += `annexeId=${d}`;
 }
 
  
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.agentAutorites = data['_embedded'].agentAutorites;
  
   console.log(data,"szszeedrr")
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);

  },
  err => {
   console.log(err);
  }
  );


}
getDataWIthFiltersAndPageAndSize2(e){
let d;
d=e
    let url = `${this.rnpService.host}/agentAutorites/search/findAgentAutoritesByAnnexeId?`;

 if (d !== undefined) {
   url += `annexeId=${d}`;
 }
 
  
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.agentAutorites = data['_embedded'].agentAutorites;
  
   console.log(data,"szszeedrr")
   this.totalPages = data['page'].totalPages
   this.totalCount = this.agentAutorites.length
   
   this.pages = new Array<number>(this.totalPages);

  },
  err => {
   console.log(err);
  }
  );


}
getDataWIthFiltersAndPageAndSize3(e){
  let d;
  d=e
      let url = `${this.rnpService.host}/agentAutorites/search/findAgentAutoritesByAnnexeId?`;
  
   if (d !== undefined) {
     url += `annexeId=${d}`;
   }
   
    
    
   
   
      
      url+=`&page=0&size=${this.size}`
      console.log(url,this.currentPage,'szszszq')
      
    this.rnpService.getOneResource(url).subscribe(
    data => {
     this.agentAutorites = data['_embedded'].agentAutorites;
    
     console.log(data,"szszeedrr")
     this.totalPages = data['page'].totalPages
     this.totalCount = this.agentAutorites.length
     
     this.pages = new Array<number>(this.totalPages);
  
    },
    err => {
     console.log(err);
    }
    );
  
  
  }
onannexeClicked(e, page = 0) {
  // this.getagentAutorites(e)
  if(e!=0){
    this.rnpService.getOneResourceById("annexes",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.annexeForhtml = data.designation
    
      this.annexeForhtml =  ' التابعين ل: '+ this.annexeForhtml

    })
  }else{
    this.annexeName = ""
     this.annexeForhtml = ""
  
  }
   this.setTotalCountForannexeselected(e)
 
  this.selectedannexe = e;
  console.log(this.selectedannexe,"qzzzzzzzzzzzzzz");
  this.annexeselected = true
  this.currentPage = page;
   this.getDataWIthFiltersAndPageAndSize()
 
  
 }
 setTotalCountForannexeselected(e){

  this.selectedannexe = e;
  
  this.annexeselected = true;
  
 this.getDataWIthFiltersForTotalCount()

 
 
}
onPageClicked(i:number){

  console.log(this.annexeselected,'annexe selected')
  
    this.currentPage = i;
  

if(this.getConnectedUserRole()=='USER-AAL'){
  this.onannexeClicked(this.annexeIdOfUserConnected,this.currentPage)
  console.log("ededede");
}else{
  if(this.annexeselected==false)
    {this.getagentAutorites(i)
      console.log("rfrfrfrf")
    }
    else{
  
      if(this.annexeselected ==true){
        this.onannexeClicked(this.selectedannexe,this.currentPage)
       
      }
    
    
    }
}

  
  }

  onSelectedSize(e){
    this.size = e.target.value
    this.getDisplayRange()
   
    this.currentPage = 0
    // this.getUsers(0) 
    if(this.getConnectedUserRole()=='USER-AAL'){
      this.onannexeClicked(this.annexeIdOfUserConnected,this.currentPage)
      console.log("ededede");
    }
    else{
  
      if(this.annexeselected==false)
        {this.getagentAutorites(0)
        }
        else{
      
          if(this.annexeselected ==true){
            this.onannexeClicked(this.selectedannexe,0)
            console.log(this.selectedannexe,"annexet")
          }
          
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
      if (this.agentAutorites?.length==0) {
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
    
      this.modelWarning().then((result) => {
        if (result.value) {
          this.rnpService.deleteResource('agentAutorites', url).subscribe({
            next: (data) => {
              if(this.getConnectedUserRole()=='USER-AAL'){
                this.getDataWIthFiltersAndPageAndSize3(this.annexeIdOfUserConnected)
              }else{
                this.onPageClicked(0); // Refresh the page data
              }
             
              this.currentPage = 0; // Reset the current page
              this.modelSuccess('لقد تم حذف عون السلطة'); // Success feedback
            },
            error: (err) => {
              console.log(err,"eded");
              if(err!.error!.cause!.cause!.message.includes('Cannot delete or update a parent row: a foreign')){
                this.modelError("لا يمكن حذف عون السلطة لأنه مرتبط بشهادة مضافة")
              }else{
                this.modelError('حدث خطأ أثناء حذف عون السلطة. يرجى المحاولة مرة أخرى.'); // Display error feedback
              }
            
            },
          });
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
     
        let url = p['_links'].self.href;
        this.router.navigateByUrl("agents/edit/"+btoa(url))
      } 
    getConnectedUserRole(){
      if(this.authService.loadToken()){
        return JSON.parse(atob(this.authService.loadToken().split('.')[1])).roles[0].authority
      }
     }
     getConnectedUserAnnexeAndAnnexeNameOfUSerAalConnected(){
      let user;
      if(this.authService.loadToken())
          user=  JSON.parse(atob(this.authService.loadToken().split('.')[1])).sub;
        console.log(user);
        this.rnpService.getOneResource(`${this.rnpService.host}/appUsers/search/findByUsername?username=${user}`).subscribe(data => {
  this.annexeIdOfUserConnected = data['_embedded'].appUsers[0].annexe.id
  
  console.log(this.annexeIdOfUserConnected,"sxsxs");
  this.rnpService.getOneResource(`${this.rnpService.host}/annexes/${this.annexeIdOfUserConnected}`).subscribe(data => {
    console.log(data,"sqsq");
    this.annexeNameOfUserConnected = ' التابعين ل: '+ data.designation
    if(this.getConnectedUserRole()=="USER-AAL"){
    
      this.getDataWIthFiltersAndPageAndSize2(this.annexeIdOfUserConnected)
    }
          })
  
      })
     
    }
   
}

