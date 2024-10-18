import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent {

  quartiers
  designation
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
   this.getReources()

}
searchByDesignation(){
  console.log(typeof this.designation)
  this.rnpService.getResourceAll2('quartiers/search/findByDesignationContainsIgnoreCase?designation='+this.designation).subscribe(data=>{
    this.quartiers = data['_embedded'].quartiers
    console.log(data)

})
}
getReources(){
  this.rnpService.getResourceAll('agentAutorites').subscribe(data=>{
    this.quartiers = data['_embedded'].agentAutorites
    console.log(this.quartiers,"zzzz")

})
}
addResource(){
    this.router.navigateByUrl("agents/add")

}
onDeleteResource(url:string){
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
    this.rnpService.deleteResource('quartiers',url).subscribe(data=>{
      this.getReources()
       },err=>{
         console.log(err)
       })
    Swal.fire({text:'لقد تم حذف الدائرة', confirmButtonColor: '#364574',   customClass:{
      title: 'kuffi',
      confirmButton: 'kuffi',
      container: 'kuffi'
    }, icon: 'success',});
  }
});
 
}
onEditResource(p:any){
 
  let url = p['_links'].self.href;
  this.router.navigateByUrl("agents/edit/"+btoa(url))
} 
}